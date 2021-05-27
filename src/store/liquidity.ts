import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { ACCOUNT_LAYOUT, MINT_LAYOUT } from '@/utils/layouts'
import { AMM_INFO_LAYOUT, AMM_INFO_LAYOUT_V3, AMM_INFO_LAYOUT_V4 } from '@/utils/liquidity'
import { LIQUIDITY_POOLS, getAddressForWhat } from '@/utils/pools'
import { commitment, getMultipleAccounts } from '@/utils/web3'

import { OpenOrders } from '@project-serum/serum'
import { PublicKey } from '@solana/web3.js'
import { TokenAmount } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'
import { LP_TOKENS, NATIVE_SOL, TOKENS, TokenInfo } from '../utils/tokens';
import {
  LIQUIDITY_POOL_PROGRAM_ID_V5,
  SERUM_PROGRAM_ID_V2,
  SERUM_PROGRAM_ID_V3
} from '../utils/ids'
import logger from '@/utils/logger'

const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,

  infos: {}
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setInitialized(state) {
    state.initialized = true
  },

  setLoading(state, loading: boolean) {
    if (loading) {
      state.countdown = AUTO_REFRESH_TIME
    }

    state.loading = loading

    if (!loading) {
      state.countdown = 0
    }
  },

  setInfos(state, infos: object) {
    state.infos = cloneDeep(infos)
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  },

  setLastSubBlock(state, lastSubBlock: number) {
    state.lastSubBlock = lastSubBlock
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestInfos({ commit }) {
      commit('setLoading', true)

      const conn = this.$web3

      const liquidityPools = {} as any
      const publicKeys = [] as any
      LIQUIDITY_POOLS.forEach((pool) => {
        const { poolCoinTokenAccount, poolPcTokenAccount, ammOpenOrders, ammId, coin, pc, lp } = pool
        publicKeys.push(
          new PublicKey(poolCoinTokenAccount),
          // feepubkey,
          new PublicKey(poolPcTokenAccount),
          new PublicKey(lp.mintAddress)
        )
        const poolInfo = cloneDeep(pool)

        poolInfo.coin.balance = new TokenAmount(0, coin.decimals)
        poolInfo.pc.balance = new TokenAmount(0, pc.decimals)

        liquidityPools[lp.mintAddress] = poolInfo
      })

      const multipleInfo = await getMultipleAccounts(conn, publicKeys, commitment)
      multipleInfo.forEach((info) => {
        if (info) {
          const address = info.publicKey.toBase58()
          const data = Buffer.from(info.account.data)

          const { key, lpMintAddress, version } = getAddressForWhat(address)

          if (key && lpMintAddress) {
            const poolInfo = liquidityPools[lpMintAddress]

            switch (key) {
              case 'poolCoinTokenAccount': {

                const parsed = ACCOUNT_LAYOUT.decode(data)
                poolInfo.coin.balance.wei = poolInfo.coin.balance.wei.plus(parsed.amount.toString())
                break
              }
              case 'poolPcTokenAccount': {
                const parsed = ACCOUNT_LAYOUT.decode(data)
                poolInfo.pc.balance.wei = poolInfo.pc.balance.wei.plus(parsed.amount.toString())
                break
              }
              case 'ammOpenOrders': {
                const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(new PublicKey(poolInfo.serumProgramId))
                const parsed = OPEN_ORDERS_LAYOUT.decode(data)

                const { baseTokenTotal, quoteTokenTotal } = parsed
                poolInfo.coin.balance.wei = poolInfo.coin.balance.wei.plus(baseTokenTotal.toNumber())
                poolInfo.pc.balance.wei = poolInfo.pc.balance.wei.plus(quoteTokenTotal.toNumber())

                break
              }
              case 'ammId': {
                let parsed
                if (version === 2) {
                  parsed = AMM_INFO_LAYOUT.decode(data)
                } else if (version === 3) {
                  parsed = AMM_INFO_LAYOUT_V3.decode(data)
                } else {
                  parsed = AMM_INFO_LAYOUT_V4.decode(data)

                  const { swapFeeNumerator, swapFeeDenominator } = parsed
                  poolInfo.fees = {
                    swapFeeNumerator: swapFeeNumerator.toNumber(),
                    swapFeeDenominator: swapFeeDenominator.toNumber()
                  }
                }

                const { needTakePnlCoin, needTakePnlPc } = parsed
                poolInfo.coin.balance.wei = poolInfo.coin.balance.wei.minus(needTakePnlCoin.toNumber())
                poolInfo.pc.balance.wei = poolInfo.pc.balance.wei.minus(needTakePnlPc.toNumber())

                break
              }
              // getLpSupply
              case 'lpMintAddress': {
                const parsed = MINT_LAYOUT.decode(data)

                poolInfo.lp.totalSupply = new TokenAmount(parsed.supply.toNumber(), poolInfo.lp.decimals)

                break
              }
            }
          }
        }
      })

      commit('setInfos', liquidityPools)
      logger('Liquidity pool infomations updated')

      commit('setInitialized')
      commit('setLoading', false)
    },
    async getFarmv1PoolInfo(): Promise<any> {
      const poolDatas = [{
        name: 'FARMv1-USDC',
        coin: { ...TOKENS.FARMv1 },
        pc: { ...TOKENS.USDC },
        lp: { ...LP_TOKENS['FARMv1-USDC'] },

        version: 5,
        programId: LIQUIDITY_POOL_PROGRAM_ID_V5,

        ammId: '7PGNXqdhrpQoVS5uQs9gjT1zfY6MUzEeYHopRnryj7rm',
        ammAuthority: 'BFCEvcoD1xY1HK4psbC5wYXVXEvmgwg4wKggk89u1NWw',
        ammOpenOrders: '3QaSNxMuA9zEXazLdD2oJq7jUCfShgtvdaepuq1uJFnS',
        ammTargetOrders: '2exvd2T7yFYhBpi67XSrCVChVwMu23g653ELEnjvv8uu',
        ammQuantities: 'BtwQvRXNudUrazbJNhazajSZXEXbrf51ddBrmnje27Li',
        poolCoinTokenAccount: '9B7Xr28yKY4JNdGbRGkTuKi1nov8p5z9BthQg2933cnC',
        poolPcTokenAccount: '3WYmCJ6bxnvEagwr1tuNbpEMEbgQjB8jMe5b3QQbDWBe',
        poolWithdrawQueue: '4q3qXQsQSvzNE1fSyEh249vHGttKfQPJWM7A3AtffEX5',
        poolTempLpTokenAccount: '8i2cZ1UCAjVac6Z76GvQeRqZMKgMyuoZQeNSsjdtEgHG',
        serumProgramId: SERUM_PROGRAM_ID_V2,
        serumMarket: '5abZGhrELnUnfM9ZUnvK6XJPoBU5eShZwfFPkdhAC7o',
        serumCoinVaultAccount: 'Gwna45N1JGLmUMGhFVP1ELz8szVSajp12RgPqCbk46n7',
        serumPcVaultAccount: '8uqjWjNQiZvoieaGSoCRkGZExrqMpaYJL5huknCEHBcP',
        serumVaultSigner: '4fgnxw343cfYgcNgWvan8H6j6pNBskBmGX4XMbhxtFbi'
      }]
      const conn = this.$web3

      const liquidityPools = {} as any
      const publicKeys = [] as any

      poolDatas.forEach((pool) => {
        const { poolCoinTokenAccount, poolPcTokenAccount, coin, pc, lp } = pool
        publicKeys.push(
          new PublicKey(poolCoinTokenAccount),
          // feepubkey,
          new PublicKey(poolPcTokenAccount),
          new PublicKey(lp.mintAddress)
        )
        const poolInfo = cloneDeep(pool)

        poolInfo.coin.balance = new TokenAmount(0, coin.decimals)
        poolInfo.pc.balance = new TokenAmount(0, pc.decimals)
        liquidityPools[lp.mintAddress] = poolInfo
      })
      const multipleInfo = await getMultipleAccounts(conn, publicKeys, commitment)

      multipleInfo.forEach((info) => {
        if (info) {
          const address = info.publicKey.toBase58()
          const data = Buffer.from(info.account.data)

          const { key, lpMintAddress, version } = getAddressForWhat(address)

          if (key && lpMintAddress) {
            const poolInfo = liquidityPools[lpMintAddress]
            switch (key) {
              case 'poolCoinTokenAccount': {
                const parsed = ACCOUNT_LAYOUT.decode(data)
                // quick fix: Number can only safely store up to 53 bits
                poolInfo.coin.balance.wei = poolInfo.coin.balance.wei.plus(parsed.amount.toString())
                break
              }
              case 'poolPcTokenAccount': {
                const parsed = ACCOUNT_LAYOUT.decode(data)
                poolInfo.pc.balance.wei = poolInfo.pc.balance.wei.plus(parsed.amount.toNumber())
                break
              }
              case 'ammOpenOrders': {
                break
              }
              case 'ammId': {

                break
              }
              // getLpSupply
              case 'lpMintAddress': {
                const parsed = MINT_LAYOUT.decode(data)
                poolInfo.lp.totalSupply = new TokenAmount(parsed.supply.toNumber(), poolInfo.lp.decimals)

                break
              }
            }
          }
        }
      })
      return liquidityPools[poolDatas[0].lp.mintAddress];
    }
  }
)

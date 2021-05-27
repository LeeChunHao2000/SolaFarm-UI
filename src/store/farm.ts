import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { FARMS, getAddressForWhat, getFarmByPoolId } from '@/utils/farms'
import {
  STAKE_INFO_LAYOUT,
  STAKE_INFO_LAYOUT_V4,
  USER_STAKE_INFO_ACCOUNT_LAYOUT,
  USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
  USER_STAKE_V6_INFO_ACCOUNT_LAYOUT
} from '@/utils/stake'
import { commitment, getFilteredProgramAccounts, getMultipleAccounts, getOwnedTokenAccounts, parseTokenAccountData,createUniqueAssociatedAccount } from '@/utils/web3'

import { ACCOUNT_LAYOUT } from '@/utils/layouts'
import { PublicKey } from '@solana/web3.js'
import { STAKE_PROGRAM_ID, STAKE_PROGRAM_ID_V4, STAKE_PROGRAM_ID_V5, STAKE_PROGRAM_ID_V6 } from '@/utils/ids'
import { TokenAmount, lt } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'
import logger from '@/utils/logger'

const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,

  infos: {},
  stakeAccounts: {}
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

  setStakeAccounts(state, stakeAccounts) {
    state.stakeAccounts = cloneDeep(stakeAccounts)
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  },

  setLastSubBlock(state, lastSubBlock: number) {
    state.lastSubBlock = lastSubBlock
  }
})
async function asyncForEach(array: any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestInfos({ commit, dispatch }) {
      commit('setLoading', true)
      dispatch('getStakeAccounts')

      const conn = this.$web3

      const farms = {} as any
      const publicKeys = [] as any

      FARMS.forEach((farm) => {
        const { lp, poolId, poolLpTokenAccount } = farm

        publicKeys.push(new PublicKey(poolId), new PublicKey(poolLpTokenAccount))

        const farmInfo = cloneDeep(farm)

        farmInfo.lp.balance = new TokenAmount(0, lp.decimals)
        farmInfo.lp.balance_farm = new TokenAmount(0, lp.decimals)
        farms[poolId] = farmInfo
      })
      // @ts-ignore
      const balances = [];
      const multipleInfo = await getMultipleAccounts(conn, publicKeys, commitment)
      multipleInfo.forEach(async (info) => {
        if (info) {
          const address = info.publicKey.toBase58()
          const data = Buffer.from(info.account.data)

          const { key, poolId } = getAddressForWhat(address)

          if (key && poolId) {
            const farmInfo = farms[poolId]

            switch (key) {
              case 'poolId': {
                let parsed

                if ([4, 5].includes(farmInfo.version)) {
                  parsed = STAKE_INFO_LAYOUT_V4.decode(data)
                } else {
                  parsed = STAKE_INFO_LAYOUT.decode(data)
                }

                farmInfo.poolInfo = parsed

                break
              }
              case 'poolLpTokenAccount': {
                const parsed = ACCOUNT_LAYOUT.decode(data);
                // @ts-ignore
                farmInfo.lp.balance_farm.wei = farmInfo.lp.balance.wei.plus(parsed.amount.toNumber());
                farmInfo.lp.balance.wei = farmInfo.lp.balance.wei.plus(parsed.amount.toNumber());
                break
              }
            }
          }
        }
      })

      commit('setInfos', farms)
      logger('Farm&Stake pool infomations updated')
      commit('setInitialized')
      commit('setLoading', false)
    },

    getStakeAccounts({ commit }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet

      if (wallet && wallet.connected) {
        // stake user info account
        const stakeFilters = [
          {
            memcmp: {
              offset: 40,
              bytes: wallet.publicKey.toBase58()
            }
          },
          {
            dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT.span
          }
        ]

        const stakeAccounts: any = {}

        getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_V6), stakeFilters)
          .then((stakeAccountInfos) => {
            stakeAccountInfos.forEach((stakeAccountInfo) => {
              const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
              const { data } = stakeAccountInfo.accountInfo

              const userStakeInfo = USER_STAKE_V6_INFO_ACCOUNT_LAYOUT.decode(data)

              const poolId = userStakeInfo.poolId.toBase58()

              const rewardDebt = userStakeInfo.rewardDebt.toNumber()

              const farm = getFarmByPoolId(poolId)

              if (farm) {
                const depositBalance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), farm.lp.decimals)

                if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
                  if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
                    stakeAccounts[poolId] = {
                      depositBalance,
                      rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                      stakeAccountAddress
                    }
                  }
                } else {
                  stakeAccounts[poolId] = {
                    depositBalance,
                    rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                    stakeAccountAddress
                  }
                }
              }
            })

            // stake user info account v4
            const stakeFiltersV4 = [
              {
                memcmp: {
                  offset: 40,
                  bytes: wallet.publicKey.toBase58()
                }
              },
              {
                dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.span
              }
            ]

            getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_V4), stakeFiltersV4)
              .then((stakeAccountInfos) => {
                stakeAccountInfos.forEach((stakeAccountInfo) => {
                  const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
                  const { data } = stakeAccountInfo.accountInfo

                  const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(data)

                  const poolId = userStakeInfo.poolId.toBase58()

                  const rewardDebt = userStakeInfo.rewardDebt.toNumber()
                  const rewardDebtB = userStakeInfo.rewardDebtB.toNumber()

                  const farm = getFarmByPoolId(poolId)

                  if (farm) {
                    const depositBalance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), farm.lp.decimals)

                    if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
                      if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
                        stakeAccounts[poolId] = {
                          depositBalance,
                          rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                          // @ts-ignore
                          rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
                          stakeAccountAddress
                        }
                      }
                    } else {
                      stakeAccounts[poolId] = {
                        depositBalance,
                        rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                        // @ts-ignore
                        rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
                        stakeAccountAddress
                      }
                    }
                  }
                })

                getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_V5), stakeFiltersV4)
                  .then((stakeAccountInfos) => {
                    stakeAccountInfos.forEach((stakeAccountInfo) => {
                      const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
                      const { data } = stakeAccountInfo.accountInfo

                      const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(data)

                      const poolId = userStakeInfo.poolId.toBase58()

                      const rewardDebt = userStakeInfo.rewardDebt.toNumber()
                      const rewardDebtB = userStakeInfo.rewardDebtB.toNumber()

                      const farm = getFarmByPoolId(poolId)

                      if (farm) {
                        const depositBalance = new TokenAmount(
                          userStakeInfo.depositBalance.toNumber(),
                          farm.lp.decimals
                        )

                        if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
                          if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
                            stakeAccounts[poolId] = {
                              depositBalance,
                              rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                              // @ts-ignore
                              rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
                              stakeAccountAddress
                            }
                          }
                        } else {
                          stakeAccounts[poolId] = {
                            depositBalance,
                            rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                            // @ts-ignore
                            rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
                            stakeAccountAddress
                          }
                        }
                      }
                    })

                    commit('setStakeAccounts', stakeAccounts)
                    logger('User StakeAccounts updated')
                  })
                  .catch()
              })
              .catch()
          })
          .catch()
      }
    }
  }
)

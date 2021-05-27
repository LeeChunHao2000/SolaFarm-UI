<template>
  <div>
    <div class="total">
      <div class="item">
        <span class="value">${{ formatToMoneyNum(allTotalTvl[0], true) }}</span>
        <span class="name">Total Value Locked</span>
      </div>
      <div class="item item-1">
        <span class="value">${{ formatToMoneyNum(allTotalTvl[1], true) }}</span>
        <span class="name">Total Customer Yield</span>
      </div>
    </div>
    <div class="nav-comp">
      <div
        v-for="(item, index) in [
          { networkId: 2, name: 'STEP' },
          { networkId: 1, name: 'RAYDIUM' },
          { networkId: 3, name: 'SERUM' }
        ]"
        :key="index"
        :class="{ item: 1 == 1, select: item.networkId == 1 }"
      >
        {{ item['name'] }}
      </div>
    </div>
    <div class="farm container">
      <div class="page-head fs-container" style="display: none">
        <span class="title"></span>
        <div class="buttons">
          <Tooltip v-if="farm.initialized" placement="bottomRight">
            <template slot="title">
              <span>
                Quote auto refresh countdown after
                {{ farm.autoRefreshTime - farm.countdown }} seconds, you can click to update manually
              </span>
              <br />
              <span> Automatically refreshes when the current pool had changed </span>
            </template>
            <Progress
              type="circle"
              :width="20"
              :stroke-width="10"
              :percent="(100 / farm.autoRefreshTime) * farm.countdown"
              :show-info="false"
              :class="farm.loading ? 'disabled' : ''"
              @click="$accessor.farm.requestInfos"
            />
          </Tooltip>
        </div>
      </div>

      <div v-if="farm.initialized">
        <div
          v-for="(farm, index) in farms"
          v-show="farm.farmInfo.version === 3 && !farm.farmInfo.legacy"
          :key="farm.farmInfo.poolId"
        >
          <template>
            <div
              class="row-row"
              v-on:click="showFarmInfo(index)"
              :class="{ selected: showFarm == index, gray: showFarm == index }"
            >
              <div class="icon">
                <img
                  v-if="farm.farmInfo.poolType == 'sp'"
                  class="bg"
                  :src="importIcon(`/coins/${farm.farmInfo.lp.coin.symbol.toLowerCase()}.png`)"
                />
                <div v-else>
                  <img class="bg1" :src="importIcon(`/coins/${farm.farmInfo.lp.coin.symbol.toLowerCase()}.png`)" />
                  <img class="bg2" :src="importIcon(`/coins/${farm.farmInfo.lp.pc.symbol.toLowerCase()}.png`)" />
                </div>
              </div>
              <span class="name">{{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}</span>
              <div class="line-1">
                <span class="size-16"
                  >APR<span class="color-blue">
                    {{ farm.farmInfo.apr == 'Infinity' ? 0 : farm.farmInfo.apr }}%</span
                  ></span
                >
                <span
                  v-if="farm.farmInfo.poolType == 'sp' || farm.farmInfo.name == 'FARMv1-USDC'"
                  class="size-14"
                  style="margin-top: 5px; font-size: 12px"
                  >STAKING</span
                >
                <span v-else class="size-14" style="margin-top: 5px; font-size: 12px">AUTO-COMPOUNDING</span>
              </div>
              <div class="line-2">
                <span class="size-14 color-gray">EARN</span>
                <span class="size-14 color-gray">BALANCE</span>
                <span class="size-14 color-gray">TOTAL DEPOSIT</span>
              </div>
              <div class="line-3">
                <span class="size-14">FARMv1</span>
                <span class="size-14"
                  >{{ getLpBalance(farm.farmInfo)
                  }}<span class="color-blue">
                    {{
                      farm.farmInfo.poolType == 'sp'
                        ? isMobile
                          ? farm.farmInfo.lp.symbol
                          : farm.farmInfo.lp.name
                        : 'LP'
                    }}</span
                  ></span
                >
                <span class="size-14 color-blue">${{ getNumber(farm.farmInfo.liquidityUsdValue, 2) }}</span>
              </div>
            </div>
            <div
              @click="showFarmInfo(index)"
              class="row-phone"
              :class="{ selected: showFarm == index, gray: showFarm == index }"
            >
              <div class="line-1">
                <div class="icon">
                  <img
                    v-if="farm.farmInfo.poolType == 'sp'"
                    class="bg"
                    :src="importIcon(`/coins/${farm.farmInfo.lp.coin.symbol.toLowerCase()}.png`)"
                  />
                  <div v-else>
                    <img
                      class="bg"
                      :src="importIcon(`/coins/${farm.farmInfo.lp.coin.symbol.toLowerCase()}.png`)"
                      alt=""
                    />
                    <img
                      class="bg2"
                      :src="importIcon(`/coins/${farm.farmInfo.lp.pc.symbol.toLowerCase()}.png`)"
                      alt=""
                    />
                  </div>
                </div>
                <span class="name">{{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}</span>
                <div className="line-1-rigth">
                  <span className="size-24 color-blue"> </span>
                  <span className="size-16"
                    >APR
                    <span className="color-blue"
                      >{{ farm.farmInfo.apr == 'Infinity' ? 0 : farm.farmInfo.apr }}%</span
                    ></span
                  >
                </div>
              </div>
              <div class="line-2">
                <span class="size-14 color-gray">EARN</span>
                <span class="size-14">FARMv1</span>
              </div>
              <div class="line-2">
                <span class="size-14 color-gray">BALANCE</span>
                <span class="size-14"
                  >{{ getLpBalance(farm.farmInfo) }}
                  <span class="color-blue">
                    {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}</span
                  ></span
                >
              </div>
              <div class="line-2">
                <span class="size-14 color-gray">TOTAL DEPOSIT</span>
                <span class="size-14 color-blue"> ${{ getNumber(farm.farmInfo.liquidityUsdValue, 2) }} </span>
              </div>
            </div>
            <div class="row-detail" v-show="showFarm == index">
              <div class="row-total">
                <div class="names">
                  <span>Your deposit</span>
                  <span style="position: relative">Reward</span>
                </div>
                <div class="values">
                  <span>{{
                    farm.userInfo && !farm.userInfo.depositBalance.isNullOrZero()
                      ? farm.userInfo.depositBalance.fixed()
                      : 0
                  }}</span>
                  <span>{{ farm.userInfo.pendingReward.format() }} FARMv1</span>
                </div>
                <div class="info" v-on:click="harvest(farm.farmInfo, farm.userInfo.pendingReward.format() * 2)">
                  {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}
                  <div>CLAIM</div>
                </div>
              </div>
              <div class="line" />
              <div class="nav-main">
                <div class="nav">
                  <span v-on:click="setCurrBtnType('deposit')" :class="currBtnType == 'deposit' ? 'select' : ''"
                    >DEPOSIT</span
                  >
                  <span v-on:click="setCurrBtnType('withdraw')" :class="currBtnType == 'withdraw' ? 'select' : ''">
                    WITHDRAW</span
                  >
                </div>

                <span v-if="currBtnType == 'withdraw'">0% fee for withdrawals</span>
                <span v-else>0.2% fee for deposit</span>
              </div>
              <div class="input">
                <div class="input-box">
                  <input
                    v-model="inputValue"
                    inputmode="decimal"
                    autocomplete="off"
                    autocorrect="off"
                    placeholder="0.00"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    minlength="1"
                    maxlength="79"
                    spellcheck="false"
                  />
                </div>
                <span>{{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}</span>
                <div @click="setMax(farm.userInfo, farm.farmInfo)">MAX</div>
              </div>
              <div class="tip">
                WALLET BALANCE:{{ getLpBalance(farm.farmInfo) }}
                {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}
              </div>
              <div class="line" />
              <div class="bottom">
                <span class="name">YOUR DEPOSIT </span>
                <span class="value"
                  >{{
                    farm.userInfo && !farm.userInfo.depositBalance.isNullOrZero()
                      ? farm.userInfo.depositBalance.fixed()
                      : 0
                  }}
                  {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}</span
                >
                <div class="btns">
                  <div class="btns">
                    <div
                      v-if="currBtnType == 'deposit'"
                      :loading="staking"
                      :disabled="staking || isNullOrZero(inputValue)"
                      ghost
                      @click="stake(farm.farmInfo)"
                    >
                      DEPOSIT
                    </div>
                    <div
                      v-if="currBtnType == 'withdraw'"
                      :loading="unstaking"
                      :disabled="unstaking || isNullOrZero(inputValue)"
                      ghost
                      @click="unstake(farm.farmInfo, farm.userInfo.pendingReward.format() * 2)"
                    >
                      WITHDRAW
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-else class="fc-container">
        <Spin :spinning="true">
          <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </Spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Tooltip, Progress, Collapse, Spin, Icon, Row, Col, Button, Alert } from 'ant-design-vue'

import { get, cloneDeep } from 'lodash-es'
import importIcon from '@/utils/import-icon'
import { TokenAmount, lt, lte, isNullOrZero } from '@/utils/safe-math'
import { getOutAmount } from '@/utils/liquidity'
import { FarmInfo } from '@/utils/farms'
import { deposit, depositV6, withdraw, rewardFarm, withdrawV6 } from '@/utils/stake'
import { getUnixTs, formatToMoneyNum, getNumber } from '@/utils'
import BigNumber from 'bignumber.js'
import { loadFarmUserAccount, loadFarmAccount, loadClockAccount } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'

const CollapsePanel = Collapse.Panel

export default Vue.extend({
  components: {
    Tooltip,
    Progress,
    Collapse,
    CollapsePanel,
    Spin,
    Icon,
    Row,
    Col,
    Button,
    Alert,
  },

  data() {
    return {
      isMobile: false,

      farms: [] as any,
      showFarm: null,
      currBtnType: 'deposit',
      lp: null,
      totalTvl: [] as any,
      totalFusionTvl: [] as any,
      allTotalTvl: [] as any,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      staking: false,
      unstakeModalOpening: false,
      unstaking: false,
      feeMessage: '0.5% fee for deposit within 3 days' as string,
      inputValue: ''
    }
  },

  head: {
    title: 'Sola.Farm'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCurrentLp(newTokenAccounts)
      },
      deep: true
    },

    'farm.infos': {
      handler() {
        this.updateFarms()
      },
      deep: true
    },

    'farm.stakeAccounts': {
      handler() {
        this.updateFarms()
      },
      deep: true
    }
  },

  mounted() {
    this.updateFarms()
  },

  methods: {
    lt,
    lte,
    isNullOrZero,
    formatToMoneyNum,
    BigNumber,
    getNumber,
    importIcon,
    TokenAmount,

    showFarmInfo(index: any) {
      this.showFarm = this.showFarm != null ? null : index
    },

    setCurrBtnType(btnType: any) {
      this.currBtnType = btnType
    },

    async getFarmV1Price() {
      const poolInfo = await this.$accessor.liquidity.getFarmv1PoolInfo()
      const amount = getOutAmount(
        // @ts-ignore
        poolInfo,
        '1',
        'CtVjQjExaBVsmJ3WYrjDZvPKYesRTZRSmzQiGj9Tqm7d',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        -0.3
      )
      return amount
    },

    getTvl() {
      let _tvl = 0
      let _reward = 0
      this.farms.map((item: any, index: any) => {
        if (item.farmInfo.version === 3 && !item.farmInfo.legacy) {
          _tvl += item.farmInfo.liquidityUsdValue
          _reward += item.userInfo.pendingReward.format() * 1
        }
      })
      _reward = _reward * 1.1
      this.totalTvl = [_tvl, _reward]
      this.getAllTotalTvl()
      return [_tvl, _reward]
    },

    getFusionTvl(tvlData: any) {
      this.totalFusionTvl = tvlData
      this.getAllTotalTvl()
    },

    getAllTotalTvl() {
      let _tvl = 0
      if (this.totalTvl.length) {
        _tvl += this.totalTvl[0] * 1
      }
      if (this.totalFusionTvl.length) {
        _tvl += this.totalFusionTvl[0] * 1
      }
      let _reward = 0
      if (this.totalTvl.length) {
        _reward += this.totalTvl[1] * 1
      }
      if (this.totalFusionTvl.length) {
        _reward += this.totalFusionTvl[1] * 1
      }
      this.allTotalTvl = [_tvl, _reward]
    },

    getMax(farmUseInfo: any, farmInfo: any) {
      let max = ''
      if (this.wallet && this.wallet.connected) {
        if (this.currBtnType == 'deposit') {
          max = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.balance`).fixed()
        } else {
          max = farmUseInfo.depositBalance.fixed()
        }
      }
      return max
    },
    getLpBalance(farmInfo: any) {
      let Balance = 0
      if (this.wallet && this.wallet.connected) {
        const _Balance = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.balance`)
        Balance = _Balance ? _Balance.fixed() : 0
      }
      return Balance
    },
    setMax(farmUseInfo: any, farmInfo: any) {
      if (this.wallet && this.wallet.connected && this.wallet.tokenAccounts) {
        if (this.currBtnType == 'deposit') {
          const lpBalance = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.balance`)
          this.inputValue = lpBalance ? lpBalance.fixed() : 0
        } else {
          this.inputValue = farmUseInfo.depositBalance.fixed()
        }
      }
    },
    async updateFarms() {
      const farms: any = []
      const rayPrice = this.price.prices['RAY']
      const FARMv1Price = await this.getFarmV1Price()
      const conn = this.$web3
      const wallet = this.$wallet || {}
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        // @ts-ignore
        if (!farmInfo.isStake && ![4, 5].includes(farmInfo.version)) {
          // @ts-ignore
          const { rewardPerShareNet, rewardPerBlock } = farmInfo.poolInfo
          // @ts-ignore
          const { reward, lp, poolType } = farmInfo
          let userInfo = await loadFarmUserAccount(
            conn,
            // @ts-ignore
            wallet.publicKey,
            new PublicKey(poolId),
            // @ts-ignore
            new PublicKey(farmInfo.programId)
          )
          const newFarmInfo = cloneDeep(farmInfo)
          userInfo = cloneDeep(userInfo)
          // @ts-ignore
          const { rewardDebt, depositBalance } = userInfo
          // @ts-ignore
          let {
            // @ts-ignore
            reward_per_share = new BigNumber(0),
            // @ts-ignore
            reward_per_second = new BigNumber(0),
            // @ts-ignore
            last_update = new BigNumber(0),
            // @ts-ignore
            total_supply = new BigNumber(0)
          } = await loadFarmAccount(
            conn,
            new PublicKey(poolId),
            // @ts-ignore
            new PublicKey(farmInfo.programId)
          )
          let tokenClockInfo = await loadClockAccount(
            conn,
            // @ts-ignore
            new PublicKey(farmInfo.programId)
          )
          tokenClockInfo = cloneDeep(tokenClockInfo)

          // @ts-ignore
          let _currSlot = tokenClockInfo.currSlot
          let a = new BigNumber(_currSlot).minus(last_update).multipliedBy(reward_per_second).div(total_supply)
          let _reward_per_share = new BigNumber(reward_per_share).plus(a).toNumber()
          const pendingReward = new BigNumber(depositBalance)
            .multipliedBy(_reward_per_share)
            .minus(rewardDebt)
            .toNumber()

          if (reward && lp) {
            const rewardPerBlockAmount = new TokenAmount(reward_per_second.toNumber(), reward.decimals)
            const liquidityItem = get(this.liquidity.infos, lp.mintAddress)

            const rewardPerBlockAmountTotalValue =
              rewardPerBlockAmount.toEther().toNumber() * 2 * 60 * 60 * 24 * 365 * Number(FARMv1Price)
            const _coinPrice =
              liquidityItem.coin.symbol == 'FARMv1'
                ? FARMv1Price
                : this.price.prices[liquidityItem?.coin.symbol as string]
            const liquidityCoinValue = (liquidityItem?.coin.balance as TokenAmount).toEther().toNumber() * _coinPrice
            const _pcPrice =
              liquidityItem.pc.symbol == 'FARMv1' ? FARMv1Price : this.price.prices[liquidityItem?.pc.symbol as string]
            const liquidityPcValue = (liquidityItem?.pc.balance as TokenAmount).toEther().toNumber() * _pcPrice

            const liquidityTotalValue = liquidityPcValue + liquidityCoinValue
            const liquidityTotalSupply = (liquidityItem?.lp.totalSupply as TokenAmount).toEther().toNumber()
            let liquidityItemValue = liquidityTotalValue / liquidityTotalSupply

            let liquidityUsdValue = lp.balance_farm.toEther().toNumber() * liquidityItemValue
            let liquidityUsdValue_farm = lp.balance.toEther().toNumber() * liquidityItemValue
            if (poolType == 'sp') {
              liquidityItemValue = liquidityTotalValue
              liquidityUsdValue = lp.balance_farm.toEther().toNumber() * _pcPrice
              liquidityUsdValue_farm = lp.balance.toEther().toNumber() * _pcPrice
            }
            let apr = ((rewardPerBlockAmountTotalValue / liquidityUsdValue_farm) * 100).toFixed(2)

            let rate = (Number(FARMv1Price) / 50) * 2
            apr = (Number(apr) + Number(apr) * rate).toFixed(2)
            // @ts-ignore
            newFarmInfo.apr = apr
            // @ts-ignore
            newFarmInfo.liquidityUsdValue = liquidityUsdValue
          }

          // @ts-ignore
          let _userInfo = {
            rewardDebt: new TokenAmount(rewardDebt, reward.decimals),
            depositBalance: new TokenAmount(depositBalance, lp.decimals),
            pendingReward: new TokenAmount(pendingReward, reward.decimals)
          }

          farms.push({
            userInfo: _userInfo,
            farmInfo: newFarmInfo
          })
        }
      }

      this.farms = farms
      this.getTvl()
    },

    updateCurrentLp(newTokenAccounts: any) {
      if (this.lp) {
        const coin = cloneDeep(this.lp)
        // @ts-ignore
        const lpBalance = get(newTokenAccounts, `${this.lp.mintAddress}.balance`)
        // @ts-ignore
        coin.balance = lpBalance

        this.lp = coin
      }
    },

    openStakeModal(poolInfo: FarmInfo, lp: any) {
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      this.stakeModalOpening = true
    },
    stake(farmInfo: any) {
      if (!this.wallet || !this.wallet.connected) {
        return
      }
      this.staking = true
      const amount = this.inputValue
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      depositV6(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Stake ${amount} ${farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
        })
        .finally(() => {
          this.staking = false
        })
    },

    cancelStake() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpening = false
    },

    openUnstakeModal(poolInfo: FarmInfo, lp: any, lpBalance: any) {
      const coin = cloneDeep(lp)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      this.unstakeModalOpening = true
    },

    unstake(farmInfo: any, rewardFarmNum: any) {
      if (!this.wallet || !this.wallet.connected) {
        return
      }
      this.unstaking = true
      const amount = this.inputValue
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      withdrawV6(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Unstake ${amount} ${farmInfo.lp.name}`
          this.$accessor.transaction.sub1({
            txid,
            description,
            cb: () => {
            }
          })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
        })
        .finally(() => {
          this.unstaking = false
        })
    },

    cancelUnstake() {
      this.lp = null
      this.farmInfo = null
      this.unstakeModalOpening = false
    },

    harvest(farmInfo: FarmInfo, rewardFarmNum: any) {
      this.harvesting = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      depositV6(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, '0')
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Harvest ${farmInfo.reward.symbol} from ${farmInfo.lp.name}`
          this.$accessor.transaction.sub1({
            txid,
            description,
            cb: () => {
            }
          })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Harvest failed',
            description: error.message
          })
        })
        .finally(() => {
          this.harvesting = false
        })
    }
  }
})
</script>

<style lang="less" scoped>
.total {
  margin: 0 72px;
  margin-top: 40px;
  margin-bottom: 47px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;

  .item {
    align-items: center;
    display: flex;
    flex-direction: column;
    .value {
      font-size: 44px;
      font-weight: bold;
      color: #5260ff;
      text-shadow: 0px 0px 3px rgba(79, 88, 193, 0.69);
    }

    .name {
      font-size: 18px;
      color: #fcfbfb;
      margin-top: 14px;
    }
  }
}

@media (max-width: 600px) {
  .total {
    margin: 0;
    margin-top: 40px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;

    .item-1 {
      margin-top: 5px;
    }
    .value {
      font-size: 30px !important;
    }
    .name {
      margin-top: 0px !important;
    }
  }
}

.nav-comp {
  height: 55px;
  background-color: #2a2e62;
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  align-items: center;

  .item {
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fcfbfb;
    text-align: center;
    cursor: pointer;

    &.select {
      background-color: #5260ff;
      border-radius: 10px;
      height: 100%;
      display: flex;
    }
  }
}

@media (max-width: 37.5rem) {
  .nav-comp {
    height: 2.75rem;
    flex-shrink: 0;

    .item {
      font-size: 1.0625rem;
    }
  }
}

.farm.container {
  max-width: 1200px;

  .row-row {
    padding: 10px 40px 10px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    // background-image   : url(../assets/images/bg.jpg);
    background-repeat: repeat;
    background-size: 15%;
    box-shadow: #000 0 0 10px 5px inset;
    border-radius: 10px;
    color: #fff;
    // background-color: #15161b;
    margin-top: 14px;
    div {
      display: flex;
      flex-direction: column;
    }
    &.select {
      border: solid 1px #5260ff;
    }

    &.gray {
      background-color: #242529 !important;
      background-image: none;
    }

    .icon {
      width: 50px;
      height: 50px;
      position: relative;
      margin-right: 13px;
      align-items: center;
      justify-content: center;
    }

    .bg {
      width: 32px;
    }

    .bg1 {
      position: absolute;
      left: 12px;
      top: 16px;
      width: 20px;
      height: 20px;
    }

    .bg2 {
      position: absolute;
      left: 20px;
      top: 4px;
      width: 20px;
      height: 20px;
    }

    .logo {
      width: 30px;
      height: 30px;
      margin-right: 13px;
      border-radius: 50%;
    }

    .name {
      font-size: 16px;
      color: #fcfbfb;
      flex: 1;
    }

    .size-24 {
      font-size: 24px;
    }

    .size-16 {
      font-size: 16px;
    }

    .size-14 {
      font-size: 14px;
    }

    .color-blue {
      color: #5260ff;
    }

    .color-gray {
      color: #b5b5b5;
    }

    span {
      line-height: 1.6;
    }

    .line-1 {
      min-width: 200px;
      align-items: center;
      position: relative;
      padding-right: 20px;

      .iconfont {
        position: absolute;
        top: 7px;
        right: 20px;
      }
    }

    .line-2 {
      // width: 120px;
    }

    .line-3 {
      width: 176px;
      align-items: flex-end;
    }
  }

  .row-phone {
    padding: 1.4375rem;
    box-shadow: #111 0 0 0.625rem 0.3125rem inset;
    border-radius: 0.625rem;
    color: #fff;
    background-color: #15161b;
    margin-top: 0.875rem;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;

    div {
      display: flex;
      flex-direction: column;
    }

    &.select {
      border: solid 1px #5260ff;
    }

    &.gray {
      background-color: #242529;
    }

    .line-1 {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0.375rem;

      .icon {
        width: 2.625rem;
        height: 2.625rem;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .bg {
        position: absolute;
        left: 0.875rem;
        top: 0;
        width: 1.625rem;
      }

      .bg2 {
        position: absolute;
        left: 0;
        top: 0.875rem;
        width: 1.625rem;
      }

      .logo {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
      }

      .name {
        flex: 1;
        font-size: 0.875rem;
        font-weight: 800;
        color: #fcfbfb;
        margin-left: 0.625rem;
      }

      .line-1-rigth {
        align-items: flex-end;
      }
    }

    .line-2 {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .size-24 {
      font-size: 1.5rem;
    }

    .size-16 {
      font-size: 1rem;
    }

    .size-14 {
      font-size: 0.875rem;
    }

    .color-blue {
      color: #5260ff;
    }

    .color-gray {
      color: #b5b5b5;
    }
  }

  .row-detail {
    padding: 24px 50px 23px 34px;
    box-shadow: #000 0 0 10px 5px inset;
    // background   : #131419;
    border-radius: 10px;
    div {
      display: flex;
      flex-direction: column;
    }

    .row-total {
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
      padding-bottom: 31px;

      .names {
        height: 70px;
        justify-content: space-between;

        span {
          font-size: 14px;
          font-weight: 500;
          color: #999999;
        }

        &:nth-child(1) {
          position: relative;
          top: 4px;
        }
      }

      .values {
        align-items: center;

        span {
          font-size: 16px;
          font-weight: 500;
          color: #5260ff;

          &:nth-child(2) {
            margin-top: 29px;
          }
        }
      }

      .info {
        align-items: flex-end;

        i {
          font-size: 15px;
          color: #fff;
        }

        div {
          width: 79px;
          height: 35px;
          background: linear-gradient(90deg, #535eff, #6138ff);
          border-radius: 18px;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          color: #f3f3f3;
          margin-top: 30px;
        }
      }
    }

    .line {
      height: 1px;
      background: #424242;
    }

    .nav-main {
      padding: 20px 0;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .nav {
        flex-direction: row;
        align-items: center;

        & > span {
          font-size: 16px;
          font-weight: bold;
          color: #c8c8c8;
          padding: 0 10px;
          position: relative;

          &::before {
            content: ' ';
            width: 1px;
            height: 11px;
            background: #c8c8c8;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          &:nth-child(1) {
            &::before {
              display: none;
            }
          }

          &.select {
            color: #5260ff;
          }
        }
      }

      & > span {
        color: #999999;
        font-size: 15px;
        font-weight: 800;
        text-align: right;
      }
    }

    .input {
      flex-direction: row;
      align-items: center;
      height: 40px;
      background: #2b2c30;
      border-radius: 20px;
      padding: 0 10px;
      position: relative;

      .input-box {
        flex: 1;
        border: none;
        background-color: transparent;
        padding: 10px;
        // padding-right: 150px;
        text-align: right;

        > input {
          outline: none;
          text-align: right;
          width: 100%;
          border: none;
          background-color: transparent;
          padding: 10px;
        }
      }

      & > span {
        font-size: 18px;
        font-weight: bold;
        color: #b6b5b5;
        flex-shrink: 0;
        // position   : absolute;
        // right      : 95px;
      }

      & > div {
        width: 65px;
        height: 33px;
        background: #403a8d;
        border-radius: 17px;
        font-size: 16px;
        font-weight: 800;
        color: #f3f3f3;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        flex-shrink: 0;
        // position       : absolute;
        // right          : 10px;
      }
    }

    .tip {
      font-size: 14px;
      font-weight: 800;
      color: #c8c8c8;
      text-align: right;
      margin-top: 17px;
      margin-bottom: 17px;
    }

    .bottom {
      padding-top: 23px;
      align-items: center;

      .name {
        color: #c8c8c8;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 24px;
        margin-top: 5px;
        font-weight: 800;
        color: #5260ff;
      }

      .btns {
        flex-direction: row;
        align-items: center;
        margin-top: 15px;

        & > div {
          background: linear-gradient(90deg, #535eff, #6138ff);
          border-radius: 30px;
          padding: 5px 20px;
          font-size: 13px;
          font-weight: 800;
          color: #fdfcfc;
          margin: 0 10px;
        }
      }
    }
  }

  .card {
    .card-body {
      padding: 0;

      .ant-collapse {
        border: 0;

        .ant-collapse-item {
          border-bottom: 0;
        }

        .ant-collapse-item:not(:last-child) {
          border-bottom: 1px solid #d9d9d9;
        }
      }
    }
  }

  .harvest {
    .reward {
      .token {
        font-weight: 600;
        font-size: 20px;
      }

      .value {
        font-size: 12px;
      }
    }

    button {
      padding: 0 30px;
    }
  }

  .start {
    .unstake {
      width: 48px;
      margin-right: 10px;
    }

    button {
      width: 100%;
    }
  }

  .harvest,
  .start {
    padding: 16px;
    border: 2px solid #1c274f;
    border-radius: 4px;

    .title {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    button {
      height: 48px;
    }
  }

  .farm-head {
    display: flex;
    align-items: center;

    .lp-icons {
      .icons {
        margin-right: 8px;
      }
    }

    .state {
      display: flex;
      flex-direction: column;
      text-align: left;

      .title {
        font-size: 12px;
        text-transform: uppercase;
      }

      .value {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }

  .is-mobile {
    .harvest,
    .start {
      margin-top: 16px;
    }
  }

  p {
    margin-bottom: 0;
  }

  .selected {
    border: 1px solid #5260ff;
  }

  .can-be-click {
    cursor: pointer;
  }
}

@media (min-width: 37.5rem) {
  .farm.container {
    .row-phone {
      display: none;
    }
  }
}

@media (max-width: 37.5rem) {
  .farm.container {
    padding: 0;
    .row-row {
      display: none;
    }

    .row-detail {
      padding: 10px 15px;
      border: solid 1px #5260ff;
      margin-top: 10px;

      .row-total {
        padding-bottom: 13px;
      }

      .tip {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-left: 0;
        text-align: left;
        font-size: 13px;
      }

      .info {
        & > div {
          // width        : 50px;
          height: 22px;
          border-radius: 10px;
          font-size: 12px;
        }
      }

      .nav-main {
        padding: 15px 0 5px;

        & > span {
          width: 100%;
          font-size: 12px;
          margin-top: 5px;
        }

        .nav {
          span {
            font-size: 14px;
          }
        }
      }

      .input {
        & > div {
          width: 54px;
          height: 28px;
          font-size: 14px;
        }

        span {
          font-size: 14px;
        }
      }

      .bottom {
        padding-top: 15px;

        .name {
          font-size: 13px;
        }

        .value {
          font-size: 18px;
        }

        .btns {
          margin-top: 5px;

          & > div {
            padding: 4px 10px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.farm {
  .farm-head {
    padding: 24px 32px !important;
  }

  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 24px 32px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #1c274f;
  }
}

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}
</style>

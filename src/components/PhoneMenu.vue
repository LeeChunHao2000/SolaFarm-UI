<template>
  <div class="mobile-menu">
    <div class="account-menu">
      <Wallet />
      <div class="group bg menus">
        <div class="item" @click="nav('/')">
          <i><span class="iconfont">&#58912;</span></i>
          <a href="https://sola.farm/" class="name">Home</a>
        </div>
        <div class="item" :class="{ select: this.$route.name == 'swap' }">
          <i><span class="iconfont">&#58899;</span></i>
          <a href="https://swap.sola.farm/#/?pair=USDC-FARMv1" class="name">Swap</a>
        </div>
        <div class="item" :class="{ select: this.$route.name == 'liquidity' }">
          <i><span class="iconfont">&#59017;</span></i>
          <a href="https://swap.sola.farm/#/add?pair=USDC-FARMv1" class="name">Liquidity</a>
        </div>
        <div class="item" :class="{ select: this.$route.name == 'index' }" @click="nav('/')">
          <i><span class="iconfont">&#58908;</span></i>
          <span class="name">Farms</span>
        </div>
        <div class="line" />
        <div class="item">
          <i><span class="iconfont">&#58913;</span></i>
          <a href="https://solafarm.medium.com‌" target="_blank" class="name">BLOG</a>
        </div>
        <div class="item">
          <i><span class="iconfont">&#58907;</span></i>
          <a href="https://pitchdeck.sola.farm/" target="_blank" class="name">ABOUT</a>
        </div>
        <div class="item">
          <i><span class="iconfont">&#58909;</span></i>
          <span class="name">GOV</span>
        </div>
        <div class="item">
          <i><span class="iconfont">&#58902;</span></i>
          <span class="name">AUDIT</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},

  data() {
    return {}
  },

  computed: {
    isMobile() {
      return this.$accessor.isMobile
    }
  },
  methods: {
    nav(url: string) {
      this.$emit('close')
      this.$router.push({ path: url })
    }
  }
})
</script>

<style lang="less" scoped>
@import url('../assets/font/iconfont.css');
.mobile-menu {
  position: fixed;
  left: 0;
  right: 0;
  top: 66px;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);

  .iconfont {
    color: #fff;
  }

  .account-menu {
    background-color: #0b0b0d;
    padding: 23px 40px;

    .key {
      background-color: rgba(82, 96, 255, 0.1);
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      // background: #5260ff;
      border-radius: 6px;
      padding: 13px 30px;

      .icon {
        font-size: 18px;
        color: #fff;
      }

      .value {
        flex: 1;
        font-size: 14px;
        color: #fff;
        margin-left: 13px;
        margin-left: 13px;
      }

      .setting {
        color: #fff;
        font-size: 16px;
      }
    }

    .menus {
      .item {
        flex-direction: row;
        align-items: center;
        padding: 20px 0;

        i {
          color: #fff;
          font-size: 18px;
          margin-left: 120px;
        }

        .name {
          color: #fff;
          font-size: 16px;
          margin-left: 17px;
        }

        &.select {
          i {
            color: #5260ff;
          }

          .name {
            color: #5260ff;
          }
        }
      }

      .line {
        height: 1px;
        background-color: #fefdfd;
        opacity: 0.15;
      }
    }
  }
}
</style>

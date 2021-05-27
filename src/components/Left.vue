<template>
  <div class="left-nav">
    <Wallet />

    <div class="group bg menus">
      <div class="item" @click="nav('/')">
        <i><span class="iconfont">&#58912;</span></i>
        <a href="https://sola.farm/" class="name">Home</a>
        <div class="hover" />
      </div>
      <div class="item" :class="isSwap">
        <i><span class="iconfont">&#58899;</span></i>
        <a href="https://swap.sola.farm/#/?pair=USDC-FARMv1" class="name">Swap</a>
        <div class="hover" />
      </div>
      <div class="item" :class="isLiquidity">
        <i><span class="iconfont">&#59017;</span></i>
        <a href="https://swap.sola.farm/#/add?pair=USDC-FARMv1" class="name">Liquidity</a>
        <div class="hover" />
      </div>
      <div class="item" :class="isFarms" @click="nav('/')" style="margin-bottom: 20px">
        <i><span class="iconfont">&#58908;</span></i>
        <span class="name">Farms</span>
        <div class="hover" />
      </div>
      <div class="line" />
      <div class="item" :class="isBlog">
        <i><span class="iconfont">&#58913;</span></i>
        <a href="https://solafarm.medium.com‌" target="_blank" class="name">BLOG</a>
        <div class="hover" />
      </div>
      <div class="item" :class="{ select: selectedNav == 'about' }">
        <i><span class="iconfont">&#58907;</span></i>
        <a href="https://pitchdeck.sola.farm/" target="_blank" class="name">ABOUT</a>
        <div class="hover" />
      </div>
      <div class="item" :class="{ select: selectedNav == 'gov' }">
        <i><span class="iconfont">&#58909;</span></i>
        <span class="name">GOV</span>
        <div class="hover" />
      </div>
      <div class="item" :class="{ select: selectedNav == 'audit' }">
        <i><span class="iconfont">&#58902;</span></i>
        <span class="name">AUDIT</span>
        <div class="hover" />
      </div>
      <div class="about">
        <div class="icon">
          <i><a href="https://github.com/SolafarmProtocol" target="_blank" class="iconfont">&#58910;</a></i>
          <i><a href="https://t.me/solaFarm" target="_blank" class="iconfont">&#58911;</a></i>
          <i><a href="https://twitter.com/solaFarm" target="_blank" class="iconfont">&#58904;</a></i>
        </div>
        <span style="display: block; position: relative; top: -10px">Powered by Sola.farm</span>
        <span style="position: relative; top: -10px">© 2021 Sola.farm All rights reserved.</span>
      </div>
    </div>
  </div>
</template>

  <script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},

  data() {
    return {
      open: false,
      account: false,
      selectedNav: 'swap' as string
    }
  },

  computed: {
    isMobile() {
      return this.$accessor.isMobile
    },
    isSwap() {
      return { select: !this.$route.name || this.$route.name == 'swap' }
    },
    isLiquidity() {
      return { select: this.$route.name == 'liquidity' }
    },
    isFarms() {
      return { select: this.$route.name == 'index' }
    },
    isBlog() {
      return { select: this.$route.name == 'blog' }
    }
  },
  methods: {
    nav(url: string) {
      this.$router.push({ path: url })
    }
  }
})
</script>

  <style lang="less" scoped>
@import url('../assets/font/iconfont.css');
.left-nav {
  display: block;
  width: 261px;
  position: relative;
  left: -70px;
  position: absolute;
  top: 76px;
  overflow-y: auto;
  max-height: calc(100vh - 76px);

  &::-webkit-scrollbar {
    display: none;
  }

  .group {
    border-radius: 10px;
    margin-top: 15px;
    padding: 20px;
  }

  .bg {
    // background-color: #15161a;
    box-shadow: #000 0 0 10px 5px inset;
  }

  .key {
    background-color: rgba(82, 96, 255, 0.1);
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .icon {
      font-size: 18px;
      color: #5260ff;
    }

    .value {
      flex: 1;
      font-size: 18px;
      color: #5260ff;
      margin-left: 13px;
      margin-left: 13px;
    }

    .setting {
      color: #fff;
      font-size: 14px;
    }
  }

  .assets {
    .name {
      font-size: 14px;
      color: #efefef;
    }

    .value {
      font-size: 24px;
      color: #5260ff;
      margin-top: 8px;
    }
  }

  .menus {
    .item {
      padding: 20px 0 0;
      flex-direction: row;
      align-items: center;
      display: flex;
      cursor: pointer;

      i {
        color: #fff;
        font-size: 18px;
      }

      .name {
        color: #fff;
        font-size: 16px;
        margin-left: 17px;
        flex: 1;
        line-height: 1;
      }

      .hover {
        width: 6px;
        height: 16px;
        background-color: transparent;
        border-radius: 3px;
      }

      &.select {
        i {
          color: #5260ff;
        }

        .name {
          color: #5260ff;
        }

        .hover {
          background-color: #5260ff;
        }
      }
    }

    .line {
      height: 1px;
      background-color: #fefdfd;
      opacity: 0.15;
      margin-top: 20px;
    }
  }

  .about {
    margin-top: 64px;

    .icon {
      flex-direction: row;
      align-items: center;
      margin-bottom: 30px;
      width: 100%;
      height: 25px;
      font-size: 25px;

      .iconfont {
        font-size: 25px;
      }

      & > i {
        font-size: 28px;
        margin-right: 23px;
        color: #efefef;
      }
    }

    & > span {
      font-size: 12px;
      // font-weight: 800;
      color: #d2d2d6;
    }
  }
}

@media (max-width: 600px) {
  .left-nav {
    display: none;
  }
}

@media (max-width: 1280px) {
  .left-nav {
    left: 0px;
  }
}
</style>

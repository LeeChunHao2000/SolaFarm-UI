<template>
  <div class="header">
    <div class="child">
      <img src="@/assets/images/logo.png" class="logo" alt="logo" />
      <span class="logoText">SolaFarm</span>
      <Left />
    </div>
    <div class="phone">
      <div class="logo-wrap">
        <img src="@/assets/images/logo.png" class="logo" alt="logo" />
        <span class="logoText">SolaFarm</span>
      </div>
      <i @click="setOpen"><span class="iconfont" style="font-size: 16px">&#xe615;</span></i>
    </div>
    <PhoneMenu v-if="open" @close="setOpen" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PhoneMenu from './PhoneMenu.vue'
import Left from './Left.vue'

export default Vue.extend({
  components: {
    PhoneMenu,
    Left
  },

  data() {
    return {
      open: false,
      account: false
    }
  },

  computed: {
    isMobile() {
      return this.$accessor.isMobile
    }
  },
  methods: {
    setOpen() {
      this.open = !this.open
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

* {
  padding: 0;
  margin: 0;
}

div {
  display: flex;
  flex-direction: column;
}

input,
textarea,
div,
view {
  box-sizing: border-box;
}

@media (max-width: 600px) {
  body {
  }
}

#root {
}

.page {
  height: 100%;
  height: 100vh;
}

.loading-wrap-wrap {
  .loading-wrap {
    position: fixed;
    top: 16px;
    right: 30px;
    color: #fff;
    border-radius: 20px;
    padding: 5px 20px 5px 20px;
    box-shadow: inset 0 0 10px 5px #000;
    flex-direction: row;

    // border       : 1px solid #82C44D;
    // box-shadow      : inset 0 0 10px 5px #000;
    // border-radius: 20px;
    align-items: center;

    .loading-text {
      margin-left: 10px;
      display: inline-block;
      font-size: 14px;
    }
  }
}

.header {
  width: 100%;
  background-color: #121318;

  .child {
    width: 1200px;
    margin: 0 auto;
    // padding-left   : 192px;
    height: 100%;
    flex-direction: row;
    align-items: center;
    z-index: 1;
    position: relative;
    .logoText {
      font-size: 18px;
      color: #fff;
      background: none;
      position: relative;
      left: -70px;
    }

    .logo {
      width: 60px;
      // height: 37px;
      position: relative;
      left: -70px;
    }

    .lang {
      height: 26px;
    }
  }

  .phone {
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .logo-wrap {
      flex-direction: row;
      align-items: center;
      img {
        height: 40px;
      }
    }

    & > i {
      color: #fff;
      font-size: 28px;
    }
  }

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
        background: #5260ff;
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
}

@media (max-width: 600px) {
  .header {
    height: 66px;
    position: fixed;

    .child {
      display: none;
    }
  }
}

@media (min-width: 600px) {
  .header {
    height: 65px;

    .phone {
      display: none;
    }
  }
}

@media (max-width: 1280px) {
  .logo {
    left: 0 !important;
  }

  .loading-wrap-wrap {
    .loading-wrap {
      position: fixed;
      top: 86px;
      right: 10px;
      color: #fff;
      z-index: 9999999;
      background: #000;
    }
  }
}
</style>

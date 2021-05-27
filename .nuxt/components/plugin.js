import Vue from 'vue'
import { wrapFunctional } from './index'

const components = {
  CoinInput: () => import('../../src/components/CoinInput.vue' /* webpackChunkName: "components/coin-input" */).then(c => wrapFunctional(c.default || c)),
  CoinModal: () => import('../../src/components/CoinModal.vue' /* webpackChunkName: "components/coin-modal" */).then(c => wrapFunctional(c.default || c)),
  CoinSelect: () => import('../../src/components/CoinSelect.vue' /* webpackChunkName: "components/coin-select" */).then(c => wrapFunctional(c.default || c)),
  Header: () => import('../../src/components/Header.vue' /* webpackChunkName: "components/header" */).then(c => wrapFunctional(c.default || c)),
  Left: () => import('../../src/components/Left.vue' /* webpackChunkName: "components/left" */).then(c => wrapFunctional(c.default || c)),
  LiquidityPoolInfo: () => import('../../src/components/LiquidityPoolInfo.vue' /* webpackChunkName: "components/liquidity-pool-info" */).then(c => wrapFunctional(c.default || c)),
  Nav: () => import('../../src/components/Nav.vue' /* webpackChunkName: "components/nav" */).then(c => wrapFunctional(c.default || c)),
  PhoneMenu: () => import('../../src/components/PhoneMenu.vue' /* webpackChunkName: "components/phone-menu" */).then(c => wrapFunctional(c.default || c)),
  Wallet: () => import('../../src/components/Wallet.vue' /* webpackChunkName: "components/wallet" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}

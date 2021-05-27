export { default as CoinInput } from '../../src/components/CoinInput.vue'
export { default as CoinModal } from '../../src/components/CoinModal.vue'
export { default as CoinSelect } from '../../src/components/CoinSelect.vue'
export { default as Header } from '../../src/components/Header.vue'
export { default as Left } from '../../src/components/Left.vue'
export { default as LiquidityPoolInfo } from '../../src/components/LiquidityPoolInfo.vue'
export { default as Nav } from '../../src/components/Nav.vue'
export { default as PhoneMenu } from '../../src/components/PhoneMenu.vue'
export { default as Wallet } from '../../src/components/Wallet.vue'

export const LazyCoinInput = import('../../src/components/CoinInput.vue' /* webpackChunkName: "components/coin-input" */).then(c => wrapFunctional(c.default || c))
export const LazyCoinModal = import('../../src/components/CoinModal.vue' /* webpackChunkName: "components/coin-modal" */).then(c => wrapFunctional(c.default || c))
export const LazyCoinSelect = import('../../src/components/CoinSelect.vue' /* webpackChunkName: "components/coin-select" */).then(c => wrapFunctional(c.default || c))
export const LazyHeader = import('../../src/components/Header.vue' /* webpackChunkName: "components/header" */).then(c => wrapFunctional(c.default || c))
export const LazyLeft = import('../../src/components/Left.vue' /* webpackChunkName: "components/left" */).then(c => wrapFunctional(c.default || c))
export const LazyLiquidityPoolInfo = import('../../src/components/LiquidityPoolInfo.vue' /* webpackChunkName: "components/liquidity-pool-info" */).then(c => wrapFunctional(c.default || c))
export const LazyNav = import('../../src/components/Nav.vue' /* webpackChunkName: "components/nav" */).then(c => wrapFunctional(c.default || c))
export const LazyPhoneMenu = import('../../src/components/PhoneMenu.vue' /* webpackChunkName: "components/phone-menu" */).then(c => wrapFunctional(c.default || c))
export const LazyWallet = import('../../src/components/Wallet.vue' /* webpackChunkName: "components/wallet" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
export function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}

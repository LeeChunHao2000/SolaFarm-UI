import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _40131a20 = () => interopDefault(import('../src/pages/acceleraytor/index.vue' /* webpackChunkName: "pages/acceleraytor/index" */))
const _36019c31 = () => interopDefault(import('../src/pages/info.vue' /* webpackChunkName: "pages/info" */))
const _3258ae7f = () => interopDefault(import('../src/pages/liquidity.vue' /* webpackChunkName: "pages/liquidity" */))
const _4ad16738 = () => interopDefault(import('../src/pages/pools.vue' /* webpackChunkName: "pages/pools" */))
const _248f5df8 = () => interopDefault(import('../src/pages/staking.vue' /* webpackChunkName: "pages/staking" */))
const _11371d50 = () => interopDefault(import('../src/pages/acceleraytor/_id.vue' /* webpackChunkName: "pages/acceleraytor/_id" */))
const _134713df = () => interopDefault(import('../src/pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/acceleraytor",
    component: _40131a20,
    name: "acceleraytor"
  }, {
    path: "/info",
    component: _36019c31,
    name: "info"
  }, {
    path: "/liquidity",
    component: _3258ae7f,
    name: "liquidity"
  }, {
    path: "/pools",
    component: _4ad16738,
    name: "pools"
  }, {
    path: "/staking",
    component: _248f5df8,
    name: "staking"
  }, {
    path: "/acceleraytor/:id",
    component: _11371d50,
    name: "acceleraytor-id"
  }, {
    path: "/",
    component: _134713df,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config.app && config.app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

import { getAccessorFromStore } from 'typed-vuex'

import { createStore } from '/Users/one/ww/gao/SolaFarm-UI/.nuxt/store'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  inject('accessor', storeAccessor(store))
}

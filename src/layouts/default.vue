<template>
  <Layout>
    <Header />
    <div class="page-root">
      <div class="left-ment"></div>
      <div class="right-main">
        <div class="right">
          <Content>
            <Nuxt />
          </Content>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { Layout } from 'ant-design-vue'
import Header from '@/components/Header.vue'

const { Content } = Layout

@Component({
  components: {
    Layout,
    Content,
    Header
  }
})
export default class Default extends Vue {}
</script>

<style lang="less">
.ant-layout-content {
  min-height: calc(100vh - 64px);
}
.page-root {
  display: flex;
  flex-direction: row;
  width: 1200px;
  margin: 0 auto;
  .left-ment {
    width: 260px;
    margin-right: 50px;
  }
  .right-main {
    flex: 1;
  }
  .right {
    width: 860px;
    padding: 0 30px;
    background: rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 37.5rem) {
  .page-root {
    display: flex;
    flex-direction: row;
    width: 100%;
    div,
    input {
      box-sizing: border-box;
    }
    .left-ment {
      display: none;
    }
    .right-main {
      flex: 1;
      margin-top: 40px;
    }
    .right {
      width: auto;
      padding: 0 5px !important;
    }
  }
}
</style>

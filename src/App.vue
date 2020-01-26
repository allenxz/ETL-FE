<!--
 * @Description:
 * @Author: Allen Tan
 * @Date: 2020-01-26 22:06:52
 * @LastEditors  : Allen Tan
 * @LastEditTime : 2020-01-26 22:12:43
 -->
<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <img src="./assets/logo.png">
      <div>
        <p>
          If Ant-Design-Vue is successfully added to this project, you'll see an
          <code v-text="'<a-button>'"></code>
          <code v-text="'<a-pagination>'"></code>
          below
        </p>
        <a-button type="primary">Primary</a-button>
        <a-pagination size="small" :total="50" showSizeChanger showQuickJumper />
      </div>
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data () {
    return {
      zhCN
    }
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

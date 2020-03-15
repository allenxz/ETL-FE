<template>
  <a-locale-provider :locale="zhCN">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'app',
  data () {
    return {
      zhCN
    }
  }
}
</script>

<style>
/* 重置浏览器默认样式 */
@import url(assets/css/reset.css);

body{
  font-size: 14px;
}
</style>

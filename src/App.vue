<!--
 * @Description:
 * @Author: Allen Tan
 * @Date: 2020-01-26 22:06:52
 * @LastEditors  : Allen Tan
 * @LastEditTime : 2020-01-26 22:32:09
 -->
<template>
  <a-locale-provider :locale="zhCN">
    <div id="app">
      basic
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
  },
  components: {
  }
}
</script>

<style>
</style>

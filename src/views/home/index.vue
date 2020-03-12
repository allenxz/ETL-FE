<template>
  <layout></layout>
</template>

<script>
import './style.scss'
import Layout from '@/components/layout'
export default {
  name: 'home',
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    Layout
  },
  created () {
    // 未登录跳转登录
    if (!localStorage.getItem('userInfo')) {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

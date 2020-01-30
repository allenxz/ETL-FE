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
  }
}
</script>

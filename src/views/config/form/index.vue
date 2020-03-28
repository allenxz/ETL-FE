<template>
  <div class="config-form">
    <div class="title">配置文件类型：{{type}}</div>
  </div>
</template>

<script>
import './style.scss'
export default {
  data () {
    return {
      type: ''
    }
  },
  mounted () {
    this.type = this.$route.params.type
  }
}
</script>

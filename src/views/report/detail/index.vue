<template>
  <div>ddd</div>
</template>

<script>
import './style.scss'
export default {
  data () {
    return {
      id: '',
      desc: ''
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getDesc()
  },
  methods: {
    // 获取任务报告详情
    async getDesc () {}
  }
}

</script>

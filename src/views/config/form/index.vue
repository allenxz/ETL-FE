<template>
  <div class="config-form">
    <div class="title">配置文件类型：{{type}}</div>
    <form-create :rule="rule" />
  </div>
</template>

<script>
import './style.scss'
export default {
  data () {
    return {
      type: '',
      rule: [
        {
          type: 'slider',
          field: 'slider2',
          title: '滑块2',
          value: [0, 52],
          props: {
            'min': 0,
            'max': 100,
            'range': true
          }
        }
      ]
    }
  },
  mounted () {
    this.type = this.$route.params.type
  }
}
</script>

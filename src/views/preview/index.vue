<template>
  <div class="preview">
    <h2>{{getTypeChineseName()}} : "{{name}}"的详情</h2>
    <pre>{{desc}}</pre>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      id: '',
      name: '',
      type: '',
      desc: ''
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.type = this.$route.params.type
    this.getDesc()
  },
  methods: {
    // 获得类别的中文名
    getTypeChineseName () {
      const map = {
        process: '流程',
        configure: '配置'
      }
      return map[this.type]
    },
    // 获取目标的具体信息
    async getDesc () {
      const map = {
        process: {
          path: '/getOneProcess',
          idName: 'processId',
          descName: 'processContent',
          name: 'processName'
        },
        configure: {
          path: '/getOneConfigure',
          idName: 'configureId',
          descName: 'configureContent',
          name: 'configureName'
        }
      }
      let res = await fetch.post(map[this.type].path, {
        [map[this.type].idName]: this.id
      })
      this.desc = JSON.parse(res.data[map[this.type].descName])
      if (this.type === 'configure' && this.desc.parameter.hasOwnProperty('password')) {
        this.desc.parameter.password = '********'
      }
      this.name = res.data[map[this.type].name]
    }
  }
}
</script>

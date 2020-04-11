<template>
  <div class="preview">
    <h2>{{getTypeChineseName()}} : "{{name}}"的详情</h2>
    <pre v-if="type === 'configure'">{{desc}}</pre>
    <div class="editer" v-else-if="type === 'process'">
      <div class="node-container">
        <div class="node-wrapper" v-for="(item, index) of desc" :key="index" @click="selectNode(index)">
          <div :class="item.appearance.class" :title="item.pluginName">
            <img :src="item.appearance.img" :alt="item.pluginName">
          </div>
        </div>
        <pre class="desc">
          {{nodeDesc}}
        </pre>
      </div>
    </div>
    <div v-else>
      <h3>输入配置文件详情：</h3>
      <pre>{{inputDesc}}</pre>
      <h3>输出配置文件详情：</h3>
      <pre>{{outputDesc}}</pre>
      <h3>数据处理流程详情：</h3>
      <pre>{{processDesc}}</pre>
    </div>
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
      desc: '',
      inputDesc: '',
      outputDesc: '',
      processDesc: '',
      nodeDesc: ''
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
        configure: '配置',
        deployment: '部署'
      }
      return map[this.type]
    },
    // 获取目标的具体信息
    async getDesc () {
      if (this.type === 'deployment') {
        this.getDeploymentDesc()
        return
      }
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
          descName: 'configureStruct',
          name: 'configureName'
        }
      }
      let res = await fetch.post(map[this.type].path, {
        [map[this.type].idName]: this.id
      })
      this.desc = JSON.parse(res.data[map[this.type].descName])
      // 删除多余键
      delete this.desc.keys
      delete this.desc.columnFirst
      if (this.type === 'configure' && this.desc.hasOwnProperty('password')) {
        this.desc.password = '********'
      }
      this.name = res.data[map[this.type].name]
    },
    // 获取配置的详情
    async getDeploymentDesc () {
      let res = await fetch.post('/getOneDeployment', {
        deploymentId: this.id
      })
      this.name = res.data.deploymentName
      // 获取下一步需要查询的id
      let sourceConfigureId = res.data.sourceConfigureId
      let targetConfigureId = res.data.targetConfigureId
      let processId = res.data.processId
      // 查询并装载输入文件详情
      let input = await fetch.post('/getOneConfigure', {
        configureId: sourceConfigureId
      })
      this.inputDesc = JSON.parse(input.data.configureContent)
      if (this.type === 'configure' && this.inputDesc.parameter.hasOwnProperty('password')) {
        this.inputDesc.parameter.password = '********'
      }
      // 查询并装载输出文件详情
      let output = await fetch.post('/getOneConfigure', {
        configureId: targetConfigureId
      })
      this.outputDesc = JSON.parse(output.data.configureContent)
      if (this.type === 'configure' && this.outputDesc.parameter.hasOwnProperty('password')) {
        this.outputDesc.parameter.password = '********'
      }
      // 查询并装载数据处理流程详情
      let process = await fetch.post('/getOneProcess', {
        processId
      })
      this.processDesc = JSON.parse(process.data.processContent)
    },
    // 选择流程结点
    selectNode (index) {
      this.nodeDesc = this.desc[index]
    }
  }
}
</script>

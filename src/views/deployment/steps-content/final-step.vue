<template>
  <div class="step">
    <!-- 图标 -->
    <div class="icon">
      <font-awesome-icon :icon="['fas', 'project-diagram']" />
    </div>
    <h1>总览</h1>
    <a-divider />
    <h2>输入配置详情：</h2>
    <a-empty v-if="readerDesc === ''" description="未选择输入配置文件"/>
    <pre class="desc">
      {{readerDesc}}
    </pre>
    <h2>输出配置详情：</h2>
    <a-empty v-if="writerDesc === ''" description="未选择输出配置文件"/>
    <pre class="desc">
      {{writerDesc}}
    </pre>
    <h2>数据处理流程详情：</h2>
    <a-empty v-if="processDesc === ''" description="未选择数据处理流程"/>
    <!-- <pre class="desc">
      {{processDesc}}
    </pre> -->
    <div class="editer">
      <div class="node-container">
        <div class="node-wrapper" v-for="(item, index) of processDesc" :key="index" @click="selectNode(index)">
          <div :class="item.appearance.class" :title="item.pluginName">
            <img :src="item.appearance.img" :alt="item.pluginName">
          </div>
        </div>
        <pre class="desc">
          {{nodeDesc}}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
// import formatJson from '@/utils/json'
export default {
  data () {
    return {
      options: [],
      readerDesc: '',
      writerDesc: '',
      processDesc: '',
      nodeDesc: ''
    }
  },
  props: ['readerID', 'writerID', 'processID'],
  created () {
    this.getProcessDesc(this.processID)
    this.getReaderDesc(this.readerID)
    this.getWriterDesc(this.writerID)
  },
  methods: {
    // 获取流程详情并格式化
    async getProcessDesc (id) {
      if (!id) {
        return
      }
      let res = await fetch.post('/getOneProcess', {
        processId: id
      })
      this.processDesc = JSON.parse(res.data.processContent)
    },
    // 获取输入配置详情并格式化
    async getReaderDesc (id) {
      if (!id) {
        return
      }
      let res = await fetch.post('/getOneConfigure', {
        configureId: id
      })
      // let configureContent = JSON.parse(res.data.configureContent)
      // if (configureContent.parameter.hasOwnProperty('password')) {
      //   configureContent.parameter.password = '********'
      // }
      // this.readerDesc = formatJson(configureContent)

      this.readerDesc = JSON.parse(res.data.configureStruct)
      delete this.readerDesc.keys
      delete this.readerDesc.columnFirst
      if (this.readerDesc.hasOwnProperty('password')) {
        this.readerDesc.password = '********'
      }
    },
    // 获取输出配置详情并格式化
    async getWriterDesc (id) {
      if (!id) {
        return
      }
      let res = await fetch.post('/getOneConfigure', {
        configureId: id
      })
      // let configureContent = JSON.parse(res.data.configureContent)
      // if (configureContent.parameter.hasOwnProperty('password')) {
      //   configureContent.parameter.password = '********'
      // }
      // this.writerDesc = formatJson(configureContent)
      this.writerDesc = JSON.parse(res.data.configureStruct)
      delete this.writerDesc.keys
      delete this.writerDesc.columnFirst
      if (this.writerDesc.hasOwnProperty('password')) {
        this.writerDesc.password = '********'
      }
    },
    // 选择流程结点
    selectNode (index) {
      let copy = JSON.parse(JSON.stringify(this.processDesc[index]))
      delete copy.appearance
      this.nodeDesc = copy
    }
  }
}
</script>

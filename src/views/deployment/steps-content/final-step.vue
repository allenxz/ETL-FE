<template>
  <div class="step">
    <!-- 图标 -->
    <div class="icon">
      <font-awesome-icon :icon="['fas', 'project-diagram']" />
    </div>
    <h1>总览</h1>
    <a-divider />
    <h2>输入配置详情：</h2>
    <pre class="desc">
      {{readerDesc}}
    </pre>
    <h2>输出配置详情：</h2>
    <pre class="desc">
      {{writerDesc}}
    </pre>
    <h2>中间流程详情：</h2>
    <pre class="desc">
      {{processDesc}}
    </pre>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
import formatJson from '@/utils/json'
export default {
  data () {
    return {
      options: [],
      readerDesc: '',
      writerDesc: '',
      processDesc: ''
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
      this.processDesc = formatJson(JSON.parse(res.data.processContent))
    },
    // 获取输入配置详情并格式化
    async getReaderDesc (id) {
      if (!id) {
        return
      }
      let res = await fetch.post('/getOneConfigure', {
        configureId: id
      })
      this.readerDesc = formatJson(JSON.parse(res.data.configureContent))
    },
    // 获取输出配置详情并格式化
    async getWriterDesc (id) {
      if (!id) {
        return
      }
      let res = await fetch.post('/getOneConfigure', {
        configureId: id
      })
      this.writerDesc = formatJson(JSON.parse(res.data.configureContent))
    }
  }
}
</script>

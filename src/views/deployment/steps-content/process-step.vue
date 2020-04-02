<template>
  <div class="step">
    <!-- 图标 -->
    <div class="icon">
      <font-awesome-icon :icon="['fas', 'sitemap']" />
    </div>
    <!-- 选择器 -->
    <a-select style="width: 50%" :defaultValue="processID" @change="getProcessDesc">
      <a-select-option v-for="item of options" :key="item.processId">
        {{item.processName}}
      </a-select-option>
    </a-select>
    <a-divider />
    <h2>内容预览：</h2>
    <pre class="desc">
      {{desc}}
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
      desc: ''
    }
  },
  props: ['processID'],
  created () {
    this.getAllProcess()
    this.getProcessDesc(this.processID)
  },
  methods: {
    // 获取所有流程并筛选出输入文件
    async getAllProcess () {
      // 第一次查询获得总长度
      let firstSearch = await fetch.post('/getAllProcess', {
        pageSize: 10,
        pageNumber: 1
      })
      let total = firstSearch.data.pageSize * firstSearch.data.totalPages
      // 第二次查询获取所有数据
      let secondSearch = await fetch.post('/getAllProcess', {
        pageSize: total,
        pageNumber: 1
      })
      this.options = secondSearch.data.processDesc
      console.log(this.options)
    },
    // 获取配置文件详情并格式化
    async getProcessDesc (value) {
      if (!value) {
        return
      }
      this.$emit('get-process', value)
      let res = await fetch.post('/getOneProcess', {
        processId: value
      })
      this.desc = formatJson(JSON.parse(res.data.processContent))
    }
  }
}
</script>

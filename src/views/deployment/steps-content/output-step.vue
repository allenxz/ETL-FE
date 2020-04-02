<template>
  <div class="step">
    <!-- 图标 -->
    <div class="icon">
      <font-awesome-icon :icon="['fas', 'file-export']" />
    </div>
    <!-- 选择器 -->
    <a-select style="width: 50%" :defaultValue="writerID" @change="getConfigDesc" placeholder="选择输入配置文件">
      <a-select-option v-for="item of options" :key="item.configureId">
        {{item.configureName}}
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
  props: ['writerID'],
  mounted () {
    this.getAllConfigures()
    this.getConfigDesc(this.writerID)
  },
  methods: {
    // 获取所有配置文件并筛选出输入文件
    async getAllConfigures () {
      // 第一次查询获得总长度
      let firstSearch = await fetch.post('/getAllConfigures', {
        pageSize: 10,
        pageNumber: 1
      })
      let total = firstSearch.data.pageSize * firstSearch.data.totalPages
      // 第二次查询获取所有数据
      let secondSearch = await fetch.post('/getAllConfigures', {
        pageSize: total,
        pageNumber: 1
      })
      // 过滤出输入配置文件
      this.options = secondSearch.data.confDesc.filter(item => item.configureType.slice(-6) === 'writer')
    },
    // 获取配置文件详情并格式化
    async getConfigDesc (value) {
      if (!value) {
        return
      }
      this.$emit('get-writer', value)
      let res = await fetch.post('/getOneConfigure', {
        configureId: value
      })
      this.desc = formatJson(JSON.parse(res.data.configureContent))
    }
  }
}
</script>

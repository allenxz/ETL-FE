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
    <a-empty v-if="desc === ''" description="未选择数据处理流程"/>
    <!-- <pre class="desc">
      {{desc}}
    </pre> -->
    <div class="editer">
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
      desc: '',
      nodeDesc: ''
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
      let search = await fetch.post('/getAllPrivateProcess')
      this.options = search.data.processDesc
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
      this.desc = JSON.parse(res.data.processContent)
    },
    // 选择流程结点
    selectNode (index) {
      let copy = JSON.parse(JSON.stringify(this.desc[index]))
      delete copy.appearance
      this.nodeDesc = copy
    }
  }
}
</script>

<template>
  <div class="process-editer">
    <div class="left">
      <a-menu mode="inline" :openKeys="openKeys" @openChange="onOpenChange" @click="addNode" :selectable="fasle">
        <a-sub-menu key="reader">
          <span slot="title"><a-icon type="cloud-server" /><span>输入源</span></span>
          <a-menu-item v-for="item of plugins.readerPlugins" :key="item.name">{{item.name}}</a-menu-item>
        </a-sub-menu>
        <a-menu-divider />
        <a-sub-menu key="writer">
          <span slot="title"><a-icon type="cluster" /><span>输出源</span></span>
          <a-menu-item v-for="item of plugins.writerPlugins" :key="item.name">{{item.name}}</a-menu-item>
        </a-sub-menu>
        <a-menu-divider />
        <a-sub-menu key="etl">
          <span slot="title"><a-icon type="deployment-unit" /><span>etl插件</span></span>
          <a-menu-item v-for="item of plugins.etlPlugins" :key="item.pluginName">{{item.pluginName}}</a-menu-item>
        </a-sub-menu>
        <a-menu-divider />
      </a-menu>
    </div>
    <div class="right">
      <!-- 工具栏 -->
      <a-row class="toolbar-container">
        <a-col :span="24">
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                删除结点
              </template>
              <a-icon type="minus" />
            </a-tooltip>
          </span>
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                多选
              </template>
              <a-icon type="appstore" />
            </a-tooltip>
          </span>
          <a-divider type="vertical" />
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                结点左移
              </template>
              <a-icon type="arrow-left" />
            </a-tooltip>
          </span>
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                结点右移
              </template>
              <a-icon type="arrow-right" />
            </a-tooltip>
          </span>
          <a-divider type="vertical" />
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                保存流程
              </template>
              <a-icon type="save" />
            </a-tooltip>
          </span>
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                清空画布
              </template>
              <a-icon type="delete" />
            </a-tooltip>
          </span>
        </a-col>
      </a-row>
      <!-- 流程编辑器主体 -->
      <div class="editer">
        <div class="node-container">
          <div class="node-wrapper" v-for="(item, index) of nodeList" :key="index">
            <div :class="item.appearance.class" :title="item.name">
              <img :src="item.appearance.img" :alt="item.name">
            </div>
          </div>
        </div>
        <div class="config-area"></div>
      </div>
    </div>

  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      rootSubmenuKeys: ['reader', 'writer', 'etl'],
      openKeys: ['reader'],
      plugins: {},
      nodeList: []
    }
  },
  mounted () {
    this.getAllPlugins()
  },
  methods: {
    // 切换左边展开的菜单
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    // 获取所有插件
    async getAllPlugins () {
      let res = await fetch.post('/getAllPlugins')
      this.plugins = res.data
      console.log(this.plugins)
    },
    // 添加结点
    addNode ({ item, key, keyPath }) {
      // 根据不同的插件之类映射其结点的形状和颜色
      const map = {
        reader: {
          shape: 'capsule',
          color: 'orange'
        },
        writer: {
          shape: 'round',
          color: 'blue'
        },
        etl: {
          shape: 'rhombus',
          color: 'purple'
        }
      }
      let newNode = {
        no: this.nodeList.length,
        name: key,
        appearance: {
          class: 'node ' + map[keyPath[1]].shape + ' ' + map[keyPath[1]].color,
          img: require('../../../assets/images/' + key + '.png')
        }
      }
      this.nodeList.push(newNode)
      console.log(this.nodeList)
    }
  }
}
</script>

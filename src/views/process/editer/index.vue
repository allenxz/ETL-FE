<template>
  <div class="process-editer">
    <!-- 工具栏 -->
    <a-row class="toolbar-container">
      <a-col :span="24">
        <span class="tool">
          <a-dropdown :trigger="['click']">
            <a-tooltip placement="top">
              <template slot="title">
                添加结点
              </template>
              <a-icon type="plus" />
            </a-tooltip>
            <a-menu slot="overlay">
              <a-sub-menu title="reader" key="test">
                <!-- <a-menu-item>3rd menu item</a-menu-item>
                <a-menu-item>4th menu item</a-menu-item> -->
              </a-sub-menu>
              <a-sub-menu title="writer" key="test">
                <!-- <a-menu-item>3rd menu item</a-menu-item>
                <a-menu-item>4th menu item</a-menu-item> -->
              </a-sub-menu>
              <a-sub-menu title="etl插件" key="test">
                <!-- <a-menu-item>3rd menu item</a-menu-item>
                <a-menu-item>4th menu item</a-menu-item> -->
              </a-sub-menu>
            </a-menu>
          </a-dropdown>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              删除结点
            </template>
            <a-icon type="minus" />
          </a-tooltip>
        </span>
        <a-divider type="vertical" />
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              复制结点
            </template>
            <a-icon type="copy" />
          </a-tooltip>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              粘贴结点
            </template>
            <a-icon type="snippets" />
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
              多选
            </template>
            <a-icon type="appstore" />
          </a-tooltip>
        </span>

      </a-col>
    </a-row>
    <!-- 流程编辑器主体 -->
    <div class="editer">
      <div class="node-container">
        <div class="node-wrapper" v-for="i of 5" :key="i">
          <div class="node rhombus purple">
            <img src="../../../assets/images/filterNullValuePlugin.png" alt="">
          </div>
        </div>
      </div>
      <div class="config-area"></div>
    </div>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      plugins: {},
      nodeList: []
    }
  },
  mounted () {
    this.getAllPlugins()
  },
  methods: {
    // 获取所有插件
    async getAllPlugins () {
      let res = await fetch.post('/getAllPlugins')
      this.plugins = res.data
      console.log(this.plugins)
    }
  }
}
</script>

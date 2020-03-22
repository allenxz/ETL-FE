<template>
  <div class="process-editer">
    <div class="left">
      <a-menu mode="inline" :openKeys="openKeys" @openChange="onOpenChange" @click="addNode" :selectable="false">
        <a-sub-menu key="reader">
          <span slot="title"><a-icon type="cloud-server" /><span>输入源</span></span>
          <a-menu-item v-for="item of plugins.readerPlugins" :key="item.name" style="border-bottom:1px solid #e8e8e8">{{item.name}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="writer">
          <span slot="title"><a-icon type="cluster" /><span>输出源</span></span>
          <a-menu-item v-for="item of plugins.writerPlugins" :key="item.name" style="border-bottom:1px solid #e8e8e8">{{item.name}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="etl">
          <span slot="title"><a-icon type="deployment-unit" /><span>etl插件</span></span>
          <a-menu-item v-for="item of plugins.etlPlugins" :key="item.pluginName" style="border-bottom:1px solid #e8e8e8">{{item.pluginName}}</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right">
      <!-- 工具栏 -->
      <a-row class="toolbar-container">
        <a-col :span="10">
          <span :class="getBtnClass('delete')" @click="deleteNode">
            <a-tooltip placement="bottom">
              <template slot="title">
                删除结点
              </template>
              <a-icon type="minus" />
            </a-tooltip>
          </span>
          <!-- 暂时屏蔽多选 -->
          <!-- <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                多选
              </template>
              <a-icon type="appstore" />
            </a-tooltip>
          </span> -->
          <a-divider type="vertical" />
          <span :class="getBtnClass('left')" @click="shiftNode('left')">
            <a-tooltip placement="bottom">
              <template slot="title">
                结点左移
              </template>
              <a-icon type="arrow-left" />
            </a-tooltip>
          </span>
          <span :class="getBtnClass('right')" @click="shiftNode('right')">
            <a-tooltip placement="bottom">
              <template slot="title">
                结点右移
              </template>
              <a-icon type="arrow-right" />
            </a-tooltip>
          </span>
          <a-divider type="vertical" />
          <span :class="getBtnClass('clear')" @click="clearCanvas">
            <a-popconfirm
              title="清空画布后无法恢复，确定要继续?"
              :visible="showClearPop"
              @confirm="confirmClear"
              @cancel="cancelClear"
              okText="是"
              cancelText="否">
              <a-tooltip placement="bottom">
                <template slot="title">
                  清空画布
                </template>
                <a-icon type="delete" />
              </a-tooltip>
            </a-popconfirm>
          </span>
          <span class="tool">
            <a-tooltip placement="bottom">
              <template slot="title">
                保存流程
              </template>
              <a-icon type="save" />
            </a-tooltip>
          </span>
        </a-col>
        <a-col :span="14">
          <div class="name-wrapper">
            <div class="name" @click="showNameModal">
              {{processName}}
            </div>
            <a-icon type="edit" class="edit-icon" />
          </div>
        </a-col>
      </a-row>
      <!-- 流程编辑器主体 -->
      <div class="editer">
        <div class="node-container">
          <div class="node-wrapper" v-for="(item, index) of nodes" :key="index" @click="selectNode(index)">
            <div :class="item.appearance.class" :title="item.name">
              <img :src="item.appearance.img" :alt="item.name">
            </div>
          </div>
        </div>
        <div class="config-area"></div>
      </div>
    </div>
    <!-- 命名对话框 -->
    <a-modal
      title="流程命名"
      v-model="visible"
      @ok="confirmName"
      @cancel="cancelName">
      <a-input id="nameInput" v-model="pendingName" placeholder="请输入..." allowClear></a-input>
    </a-modal>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      processName: '未命名',
      pendingName: '', // 待定的流程名，未确认
      visible: false, // 对话框是否可见
      showClearPop: false, // 是否显示清空的二次提醒框
      rootSubmenuKeys: ['reader', 'writer', 'etl'], // 左侧菜单key
      openKeys: ['reader'], // 默认展开的key
      plugins: {}, // 所有的插件信息
      nodes: [], // 所有的结点
      selectedNodes: [], // 被选中的结点，装的是元素的index
      isMutiSelect: false, // 是否多选
      isSave: false // 是否开始修改了但是没保存
    }
  },
  mounted () {
    this.getAllPlugins()
  },
  computed: {
    // 计算删除按钮的状态,true--禁止点击,false--允许点击
    deleteBtnState () {
      return this.selectedNodes.length === 0
    },
    // 计算清空按钮的状态,true--禁止点击,false--允许点击
    clearBtnState () {
      return this.nodes.length === 0
    },
    // 计算左移按钮的状态,true--禁止点击,false--允许点击
    leftBtnState () {
      return this.selectedNodes.length === 0 || this.selectedNodes[0] === 0
    },
    // 计算右移按钮的状态,true--禁止点击,false--允许点击
    rightBtnState () {
      let selectedLen = this.selectedNodes.length
      let nodesLen = this.nodes.length
      return this.selectedNodes.length === 0 || this.selectedNodes[selectedLen - 1] === nodesLen - 1
    }
  },
  methods: {
    // 获取结点样式
    getBtnClass (btnName) {
      let statePrpo = btnName + 'BtnState'
      return this[statePrpo] ? 'tool disable' : 'tool'
    },
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
    },
    // 显示命名对话框
    showNameModal () {
      this.pendingName = this.processName
      this.visible = true
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    // 确定命名
    confirmName () {
      if (this.processName === '') {
        this.$message.error('流程名不能为空')
        return
      }
      this.processName = this.pendingName
      this.visible = false
    },
    // 取消命名
    cancelName () {
      this.visible = false
    },
    // 清空画布
    clearCanvas () {
      // 可以点击的情况下再再显示二次确认框
      if (!this.clearBtnState) {
        this.showClearPop = true
      }
    },
    // 确认清空
    confirmClear () {
      this.nodes = []
      this.selectedNodes = []
      this.showClearPop = false
    },
    // 取消清空
    cancelClear () {
      this.showClearPop = false
    },
    // 添加结点
    addNode ({ item, key, keyPath }) {
      this.isSave = false
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
      // 装载新结点
      let newNode = {
        name: key,
        appearance: {
          class: 'node ' + map[keyPath[1]].shape + ' ' + map[keyPath[1]].color,
          img: require('../../../assets/images/' + key + '.png')
        }
      }
      this.nodes.push(newNode)
    },
    // 删除结点
    deleteNode (e) {
      this.isSave = false
      // 阻止没有结点时的点击事件
      if (this.deleteBtnState) {
        return
      }
      // 删除选中的结点
      this.selectedNodes.forEach(index => {
        let t = document.querySelectorAll('.node')[index]
        t.classList.remove('selected')
        this.nodes.splice(index, 1)
      })
      this.selectedNodes = []
    },
    // 选择结点
    selectNode (index) {
      let target = document.querySelectorAll('.node')[index]
      let arrIndex = this.selectedNodes.indexOf(index)
      // 判断自己是否已选中
      if (arrIndex > -1) {
        // 取消自己的已选中状态
        this.selectedNodes.splice(arrIndex, 1)
        target.classList.remove('selected')
      } else {
        // 非多选情况下，清除其他结点的选中效果
        if (!this.isMutiSelect) {
          this.selectedNodes.forEach(i => {
            let t = document.querySelectorAll('.node')[i]
            t.classList.remove('selected')
          })
          this.selectedNodes = []
        }
        // 选中自己
        this.selectedNodes.push(index)
        target.classList.add('selected')
      }
      this.autoSort()
    },
    // 移动结点
    shiftNode (direction) {
      this.isSave = false
      // 阻止没有结点时的点击事件
      if ((direction === 'left' && this.leftBtnState) || (direction === 'right' && this.rightBtnState)) {
        return
      }
      // 判断被选中的元素中左边界的结点，移动后的边际结点以及需要移动的元素数量
      let num = this.selectedNodes.length
      let edgeIndex = this.selectedNodes[0]
      let newEdgeIndex = direction === 'left' ? edgeIndex - 1 : edgeIndex + 1
      // 先将需要移动的元素删除
      let shiftedNodes = this.nodes.splice(edgeIndex, num)
      // 再把它们添加到移动后的位置
      this.nodes.splice(newEdgeIndex, 0, ...shiftedNodes)
      // 消除原本的选中效果
      this.selectedNodes.forEach(i => {
        let t = document.querySelectorAll('.node')[i]
        t.classList.remove('selected')
      })
      this.selectedNodes = []
      // 为新结点添加效果
      for (let i = newEdgeIndex; i < newEdgeIndex + num; i++) {
        let t = document.querySelectorAll('.node')[i]
        t.classList.add('selected')
        this.selectedNodes.push(i)
      }
      this.autoSort()
    },
    // 被选结点数组自排序
    autoSort () {
      this.selectedNodes.sort((a, b) => {
        return a - b
      })
    }
  }
}
</script>

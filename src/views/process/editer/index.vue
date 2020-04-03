<template>
  <div class="process-editer">
    <div class="left">
      <a-menu mode="inline" :openKeys.sync="openKeys" @click="addNode" :selectable="false">
        <a-sub-menu key="reader">
          <span slot="title"><a-icon type="cloud-server" /><span>输入源</span></span>
          <a-menu-item v-for="item of plugins.readerPlugins" :id="item.pluginName" :key="item.pluginName" :disabled="hasReaderNode" style="border-bottom:1px solid #e8e8e8">{{item.showName}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="writer">
          <span slot="title"><a-icon type="cluster" /><span>输出源</span></span>
          <a-menu-item v-for="item of plugins.writerPlugins" :id="item.pluginName" :key="item.pluginName" :disabled="hasWriterNode" style="border-bottom:1px solid #e8e8e8">{{item.showName}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="etl">
          <span slot="title"><a-icon type="deployment-unit" /><span>etl插件</span></span>
          <a-menu-item v-for="item of plugins.etlPlugins" :id="item.pluginName" :data-class-path="item.classPath" :key="item.pluginName" style="border-bottom:1px solid #e8e8e8">{{item.showName}}</a-menu-item>
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
        </a-col>
        <a-col :span="14">
          <a-button type="primary" size="small" @click="saveProcess">保存</a-button>
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
            <div :class="item.appearance.class" :title="item.pluginName">
              <img :src="item.appearance.img" :alt="item.pluginName">
            </div>
          </div>
        </div>
        <div class="config-area">
          <div class="title">配置参数</div>
          <div class="main">
            <!-- 未选中 -->
            <a-empty
              v-if="selectedNodes.length === 0"
              class="empty"
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              :imageStyle="{
                height: '60px'
              }">
              <span slot="description">先选中结点再进行配置</span>
            </a-empty>
            <!-- 该结点不需要配置 -->
            <a-empty class="empty" v-if="selectedNodes.length !== 0 && nodes[selectedNodes[0]].type !== 'etl'">
              <span slot="description">该结点不是etl插件,无须配置</span>
            </a-empty>
            <!-- 配置结点 -->
            <div v-if="selectedNodes.length !== 0 && nodes[selectedNodes[0]].type === 'etl'">
              <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="saveConfig">
                <a-form-item
                  v-for="(item, index) of parameters"
                  :key="index"
                  :label="item.filedName"
                  :required="item.necessary"
                  :extra="item.desc">
                  <a-input
                    v-decorator="[item.pluginTrueField, { rules: [{ required: item.necessary, message: '该项为必填字段不能为空' }] }]"
                    :placeholder="nodes[selectedNodes[0]].parameters && nodes[selectedNodes[0]].parameters[item.pluginTrueField]"
                  />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                  <a-button type="primary" html-type="submit">
                    保存
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
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
      processId: '',
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
      isSaved: true, // 是否开始修改了但是没保存
      parameters: [], // 需要配置的参数数组
      form: this.$form.createForm(this, { name: 'coordinated' }),
      hasWriterNode: false, // 是否已经存在输出源
      hasReaderNode: false // 是否已经存在输入源
    }
  },
  mounted () {
    this.getAllPlugins()
    let id = this.$route.params.id
    if (id) {
      this.loadProcess(id)
      this.processId = id
    }
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
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
    // 提示刷新前保存
    beforeunloadFn (e) {
      e = e || window.event

      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '请确认你已经保存好所有的信息，退出后数据无法恢复！'
      }

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '请确认你已经保存好所有的信息，退出后数据无法恢复！'
    },
    // 获取结点样式
    getBtnClass (btnName) {
      let statePrpo = btnName + 'BtnState'
      return this[statePrpo] ? 'tool disable' : 'tool'
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
      this.hasWriterNode = false
      this.hasReaderNode = false
    },
    // 取消清空
    cancelClear () {
      this.showClearPop = false
    },
    // 添加结点
    addNode ({ item, key, keyPath }) {
      this.isSaved = false
      // 禁止往输入源后添加结点
      if (this.nodes.length === 0 && keyPath[1] !== 'reader') {
        this.$message.error('流程的开端必须为输入源')
        return
      }
      if (this.nodes.length !== 0 && this.nodes[this.nodes.length - 1].type === 'writer') {
        this.$message.error('输入源为流程的结束，后面无法添加结点')
        return
      }
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
        pluginName: key,
        type: keyPath[1],
        appearance: {
          class: 'node ' + map[keyPath[1]].shape + ' ' + map[keyPath[1]].color,
          img: require('../../../assets/images/' + key + '.png')
        }
      }
      let target = document.getElementById(key)
      newNode.classPath = target.dataset.classPath
      this.nodes.push(newNode)
      // 记录writer和reader的数量
      if (newNode.type === 'writer') {
        this.hasWriterNode = true
      } else if (newNode.type === 'reader') {
        this.hasReaderNode = true
      }
    },
    // 删除结点
    deleteNode (e) {
      this.isSaved = false
      // 阻止没有结点时的点击事件
      if (this.deleteBtnState) {
        return
      }
      // 重新判断结点中输入源和输出源
      if (this.nodes[this.selectedNodes[0]].type === 'writer') {
        this.hasWriterNode = false
      } else if (this.nodes[this.selectedNodes[0]].type === 'reader') {
        this.hasReaderNode = false
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
      // 排序
      this.autoSort()
      if (this.selectedNodes.length !== 0) {
        this.genconfigForm()
      }
    },
    // 移动结点
    shiftNode (direction) {
      this.isSaved = false
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
      // 延迟操作，等dom进行重新渲染
      setTimeout(() => {
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
      }, 50)
    },
    // 被选结点数组自排序
    autoSort () {
      this.selectedNodes.sort((a, b) => {
        return a - b
      })
    },
    // 生成配置表单
    genconfigForm () {
      if (this.nodes[this.selectedNodes[0]].type !== 'etl') {
        return
      }
      this.parameters = []
      let pluginName = this.nodes[this.selectedNodes[0]].pluginName
      for (let i = 0, len = this.plugins.etlPlugins.length; i < len; i++) {
        if (pluginName === this.plugins.etlPlugins[i].pluginName) {
          this.parameters = this.plugins.etlPlugins[i].parameters
          break
        }
      }
    },
    // 保存配置
    saveConfig (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.nodes[this.selectedNodes[0]].parameters = values
          this.$message.success('该插件参数配置完毕')
          this.selectedNodes.forEach(i => {
            let t = document.querySelectorAll('.node')[i]
            t.classList.remove('selected')
          })
          this.selectedNodes = []
        }
      })
    },
    // 保存流程
    async saveProcess () {
      if (this.nodes.length === 0) {
        this.$message.error('当前流程并无结点，无须保存')
        return
      }
      if (!this.hasReaderNode || !this.hasWriterNode) {
        this.$message.error('流程图至少包含一个输入源和一个输出源')
        return
      }
      if (this.nodes[0].type !== 'reader' ||
        this.nodes[this.nodes.length - 1].type !== 'writer') {
        this.$message.error('流程图必须以输入源开始，以输出源结束')
        return
      }
      // 检查流程中的etl插件是否全部完成配置
      let noConfiguredIndexs = []
      this.nodes.forEach((item, index) => {
        if (item.type === 'etl' && item.parameters === undefined) {
          noConfiguredIndexs.push(index)
        }
      })
      if (noConfiguredIndexs.length !== 0) {
        this.$message.error('请完成流程中etl插件参数的配置')
      } else if (this.processName === '未命名') {
        this.$message.error('该流程图未命名,请先命名后提交')
        this.showNameModal()
      } else {
        let res
        // 创建流程
        if (this.processId === '') {
          res = await fetch.post('/addProcess', {
            processName: this.processName,
            processContent: JSON.stringify(this.nodes)
          })
        } else {
          // 更新流程
          res = await fetch.post('/updateProcess', {
            processId: this.processId,
            processName: this.processName,
            processContent: JSON.stringify(this.nodes)
          })
        }

        this.$message.success(res.data.message)
        this.$router.push({ path: '/process-manage' })
      }
    },
    // 加载流程
    async loadProcess (id) {
      let res = await fetch.post('/getOneProcess', {
        processId: id
      })
      this.processName = res.data.processName
      this.nodes = JSON.parse(res.data.processContent)
      console.log(this.nodes)
      this.hasWriterNode = true
      this.hasReaderNode = true
    }
  }
}
</script>

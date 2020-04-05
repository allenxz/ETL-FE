<template>
  <div class="deployment-editer">
    <a-steps v-model="current" @change="onChange">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <InputStep
        v-if="current === 0"
        :readerID="readerID"
        @get-reader="(value) => {this.readerID = value}">
      </InputStep>
      <OutputStep
        v-if="current === 1"
        :writerID="writerID"
        @get-writer="(value) => {this.writerID = value}">
      </OutputStep>
      <ProcessStep
        v-if="current === 2"
        :processID="processID"
        @get-process="(value) => {this.processID = value}">
      </ProcessStep>
      <FinalStep
        v-if="current === 3"
        :readerID="readerID"
        :writerID="writerID"
        :processID="processID">
      </FinalStep>
    </div>
    <div class="steps-action">
      <a-button v-if="current>0" style="margin-right: 8px" @click="prev">
        上一步
      </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current == steps.length - 1"
        type="primary"
        @click="submit"
      >
        提交
      </a-button>
    </div>
    <a-modal
      title="配置命名"
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
import InputStep from '../steps-content/input-step'
import OutputStep from '../steps-content/output-step'
import ProcessStep from '../steps-content/process-step'
import FinalStep from '../steps-content/final-step'
export default {
  components: {
    InputStep,
    OutputStep,
    ProcessStep,
    FinalStep
  },
  data () {
    return {
      current: 0,
      steps: [
        {
          title: '选择输入配置文件'
        },
        {
          title: '选择输出配置文件'
        },
        {
          title: '选择数据处理流程'
        },
        {
          title: '提交'
        }
      ],
      readerID: '',
      writerID: '',
      processID: '',
      visible: false,
      deploymentName: '',
      deploymentId: '',
      pendingName: ''
    }
  },
  mounted () {
    let deploymentId = this.$route.params.id
    if (deploymentId) {
      this.isEdit = true
      this.deploymentId = deploymentId
      this.initSteps()
    }
  },
  watch: {
    // 步骤切换的时候回到顶部
    current () {
      window.scrollTo(0, 0)
    }
  },
  methods: {
    // 下一步
    next () {
      this.current++
    },
    // 上一步
    prev () {
      this.current--
    },
    // 提交
    async submit () {
      // 准备数据
      let reader = await fetch.post('/getOneConfigure', {
        configureId: this.readerID
      })
      let writer = await fetch.post('/getOneConfigure', {
        configureId: this.writerID
      })
      let process = await fetch.post('/getOneProcess', {
        processId: this.processID
      })
      let readerType = JSON.parse(reader.data.configureContent).name.slice(0, 2)
      let writerType = JSON.parse(writer.data.configureContent).name.slice(0, 2)
      let processContent = JSON.parse(process.data.processContent)
      let processReaderType = processContent[0].pluginName.slice(0, 2)
      let processWriterType = processContent[processContent.length - 1].pluginName.slice(0, 2)
      // 校验
      if (this.readerID === '') {
        this.$message.error('输入配置文件未选择')
        this.current = 0
        return
      } else if (this.writerID === '') {
        this.$message.error('输出配置文件未选择')
        this.current = 1
        return
      } else if (this.processID === '') {
        this.$message.error('中间流程未选择')
        this.current = 2
        return
      } else if (readerType !== processReaderType) {
        this.$message.error('输入配置文件和中间流程不匹配')
        this.current = 2
        return
      } else if (writerType !== processWriterType) {
        this.$message.error('输出配置文件和中间流程不匹配')
        this.current = 2
        return
      }
      this.showNameModal()
    },
    // 确定命名
    confirmName () {
      if (this.pendingName === '') {
        this.$message.error('部署文件名不能为空')
        return
      }
      this.deploymentName = this.pendingName
      this.visible = false
      if (!this.isEdit) {
        this.addDeployment()
      } else {
        this.updateDeployment()
      }
    },
    // 取消命名
    cancelName () {
      this.visible = false
    },
    // 显示命名对话框
    showNameModal () {
      this.pendingName = this.deploymentName
      this.visible = true
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    // 初始化步骤条
    async initSteps () {
      let res = await fetch.post('/getOneDeployment', {
        deploymentId: this.deploymentId
      })
      this.readerID = res.data.sourceConfigureId
      this.writerID = res.data.targetConfigureId
      this.processID = res.data.processId
      this.deploymentName = res.data.deploymentName
    },
    // 添加部署
    async addDeployment () {
      let res = await fetch.post('/addDeployment', {
        deploymentName: this.deploymentName,
        sourceConfigureId: this.readerID,
        targetConfigureId: this.writerID,
        processId: this.processID
      })
      this.$message.success(res.data.message)
      this.$router.push({ path: '/deployment-manage' })
    },
    // 更新部署
    async updateDeployment () {
      let res = await fetch.post('/updateDeployment', {
        deploymentId: this.deploymentId,
        deploymentName: this.deploymentName,
        sourceConfigureId: this.readerID,
        targetConfigureId: this.writerID,
        processId: this.processID
      })
      this.$message.success(res.data.message)
      this.$router.push({ path: '/deployment-manage' })
    },
    // 点击切换
    onChange (current) {
      this.current = current
    }
  }
}
</script>

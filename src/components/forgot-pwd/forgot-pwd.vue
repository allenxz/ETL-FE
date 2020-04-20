<template>
  <div>
    <a-modal
      title="回答密保问题"
      :visible="isShow"
      @ok="handleOk"
      @cancel="handleCancel">
      <div v-if="!isReset">
        <a-input-search placeholder="输入用户名获取密保问题" @search="getQuestions" v-model="username" enterButton  style="margin-bottom:10px;"/>
        <a-input-group compact style="margin-bottom:10px;">
          <a-select style="width: 20%" defaultValue="0" @change="changeQuestion">
            <a-select-option value="0">问题一</a-select-option>
            <a-select-option value="1">问题二</a-select-option>
            <a-select-option value="2">问题三</a-select-option>
          </a-select>
          <a-input style="width: 80%" v-model="curQuestion" disabled/>
        </a-input-group>
        <a-input-group compact>
          <a-input addonBefore="答案:" v-model="answer"/>
        </a-input-group>
      </div>
      <div v-else>
        <a-input-group compact style="margin-bottom:10px;">
          <a-input-password addonBefore="输入新密码:" v-model="newPwd"/>
        </a-input-group>
        <a-input-group compact style="margin-bottom:10px;">
          <a-input-password addonBefore="再次确认密码:" v-model="confirmPwd"/>
        </a-input-group>
      </div>
    </a-modal>
  </div>
</template>

<script>
import fetch from '@/services/fetch'
export default {
  props: ['visible'],
  data () {
    return {
      isShow: this.visible,
      questions: [],
      curQuestion: '',
      username: '',
      answer: '',
      selectedKey: 0,
      isReset: false,
      newPwd: '',
      confirmPwd: ''
    }
  },
  watch: {
    visible (newVal) {
      this.isShow = newVal
    }
  },
  methods: {
    async handleOk () {
      if (!this.isReset) {
        if (!this.username || !this.answer) {
          this.$message.error('请先查询密保问题并作答')
          return
        }
        if (this.answer === this.questions[this.selectedKey].answer) {
          this.$message.success('回答正确，请重新设置你的密码')
          this.isReset = true
        } else {
          this.$message.error('回答错误，请重新作答')
        }
      } else {
        if (!this.newPwd || !this.confirmPwd) {
          this.$message.error('请填写完整再提交')
        } else if (this.newPwd !== this.confirmPwd) {
          this.$message.error('前后输入的密码不一致')
          this.newPwd = ''
          this.confirmPwd = ''
        } else if (this.newPwd.length < 6) {
          this.$message.error('密码长度至少6位')
          this.newPwd = ''
          this.confirmPwd = ''
        } else {
          let res = await fetch.post('/changePassword', {
            username: this.username,
            password: this.newPwd
          })
          if (res.data) {
            this.isShow = false
            this.$message.success(res.data.message)
          } else {
            this.$message.erroe(res.exception)
            this.resetData()
          }
        }
      }
    },
    handleCancel () {
      this.isShow = false
      this.$emit('close')
      this.resetData()
    },
    // 重置信息
    resetData () {
      this.questions = []
      this.curQuestion = ''
      this.username = ''
      this.selectedKey = 0
      this.answer = ''
      this.isReset = false
      this.newPwd = ''
      this.confirmPwd = ''
    },
    // 获得密保问题
    async getQuestions () {
      if (!this.username) {
        this.$message.error('请先输入用户名')
        return
      }
      let res = await fetch.post('/getUserQuestionsWithoutLogin', {
        username: this.username
      })
      if (res.data) {
        this.questions = res.data.questionAndAnswers
        this.changeQuestion(this.selectedKey)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 切换密保问题
    changeQuestion (value) {
      this.selectedKey = value
      if (this.questions.length === 0) {
        return
      }
      this.curQuestion = this.questions[value].question
    }
  }
}

</script>

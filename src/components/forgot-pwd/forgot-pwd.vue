<template>
  <div>
    <a-modal
      title="回答密保问题"
      :visible="isShow"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-input-group compact>
        <a-select defaultValue="0" @change="changeQuestion" >
          <a-select-option value="0">问题一</a-select-option>
          <a-select-option value="1">问题二</a-select-option>
          <a-select-option value="2">问题三</a-select-option>
        </a-select>
        <a-input style="width: 50%" :defaultValue="curQuestion" />
      </a-input-group>
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
      curQuestion: ''
    }
  },
  mounted () {
    this.getQuestions()
  },
  watch: {
    visible (newVal) {
      this.isShow = newVal
    }
  },
  methods: {
    handleOk () {
      this.isShow = false
    },
    handleCancel () {
      this.isShow = false
    },
    // 获得密保问题
    async getQuestions () {
      let res = await fetch.post('/getUserQuestionsWithoutLogin')
      if (res.data) {
        this.questions = res.data.questionAndAnswers
      } else {
        this.$message.error('密保问题获取失败，请联系管理员！')
      }
    },
    // 切换密保问题
    changeQuestion (value) {
      this.curQuestion = this.questions[value]
    }
  }
}

</script>

<template>
  <div class="deployment-editer">
    <a-steps :current="current">
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
        @click="$message.success('Processing complete!')"
      >
        提交
      </a-button>
    </div>
  </div>
</template>
<script>
import './style.scss'
import InputStep from '../steps-content/input-step'
import OutputStep from '../steps-content/output-step'
export default {
  components: {
    InputStep,
    OutputStep
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
          title: '选择中间处理流程'
        },
        {
          title: '提交'
        }
      ],
      readerID: '',
      writerID: ''
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
    }
  }
}
</script>

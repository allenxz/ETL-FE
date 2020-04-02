<template>
  <div class="deployment-editer">
    <a-steps :current="current" @change="onChange">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <InputStep
        v-if="current === 0"
        :readerID="readerID"
        @get-reader="(value) => {this.readerID = value}"></InputStep>
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
export default {
  components: {
    InputStep
  },
  data () {
    return {
      current: 0,
      steps: [
        {
          title: '选择输入配置文件'
        },
        {
          title: '选择输出配置文件',
          content: 'Second-content'
        },
        {
          title: '选择中间处理流程',
          content: 'Second-content'
        },
        {
          title: '提交',
          content: 'Last-content'
        }
      ],
      readerID: ''
    }
  },
  methods: {
    // 切换步骤
    onChange (current) {
      this.current = current
    },
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

<template>
  <div class="report-detail">
    <a-descriptions title="任务报告" bordered>
      <a-descriptions-item label="部署名">{{desc.deploymentName}}</a-descriptions-item>
      <a-descriptions-item label="输入配置名">{{desc.sourceConfigureName}}</a-descriptions-item>
      <a-descriptions-item label="输出配置名">{{desc.targetConfigureName}}</a-descriptions-item>
      <a-descriptions-item label="数据处理流程名">{{desc.processName}}</a-descriptions-item>
      <a-descriptions-item label="部署拥有者用户名">{{desc.startUserName}}</a-descriptions-item>
      <a-descriptions-item label="部署启动者用户名">{{desc.startUserName}}</a-descriptions-item>
      <a-descriptions-item label="部署停止者用户名">{{desc.stopUserName || '无'}}</a-descriptions-item>
      <a-descriptions-item label="部署启动时间">
        {{formatDateTime(desc.startTime)}}
      </a-descriptions-item>
      <a-descriptions-item label="部署结束时间">
        {{formatDateTime(desc.endTime)}}
      </a-descriptions-item>
      <a-descriptions-item label="任务报告生成时间">
        {{formatDateTime(desc.recordTime)}}
      </a-descriptions-item>
      <a-descriptions-item label="任务最终状态">
        <a-tag :color="getStateColor(desc.state)">{{desc.state}}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="异常信息">{{desc.throwable || '无'}}</a-descriptions-item>
      <a-descriptions-item label="统计数据" :span="3">
        <a-row :gutter="16" style="margin-bottom:15px;">
          <a-col :span="24">
            <a-statistic title="已完成任务数 / 总任务数" :value="desc.finishTasks">
              <template v-slot:suffix>
                <span> / {{desc.taskNum}}</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-bottom:15px;">
          <a-col :span="6">
            <a-statistic title="成功读取记录数" :value="desc.readSucceedRecords">
              <template v-slot:suffix>
                <span>条</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="成功读取字节数" :value="desc.readSucceedRecords">
              <template v-slot:suffix>
                <span>字节</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="成功写入记录数" :value="desc.writeSucceedRecords">
              <template v-slot:suffix>
                <span>条</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="成功写入字节数" :value="desc.writeSucceedBytes">
              <template v-slot:suffix>
                <span>字节</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-bottom:15px;">
          <a-col :span="6">
            <a-statistic title="输入ETL模块总数据量" :value="desc.totalInputEtlRecords">
              <template v-slot:suffix>
                <span>条</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="输出ETL模块总数据量" :value="desc.totalOutputEtlRecords">
              <template v-slot:suffix>
                <span>字节</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="平均字节处理速度" :value="desc.averageByteSpeed">
              <template v-slot:suffix>
                <span>字节/秒</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="平均记录处理速度" :value="desc.averageRecordSpeed">
              <template v-slot:suffix>
                <span>字节/秒</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
      </a-descriptions-item>
      <a-descriptions-item label="reader配置文件" :span="3">
        <pre>
          {{formatJson(desc.sourceConfigureContent)}}
        </pre>
      </a-descriptions-item>
      <a-descriptions-item label="writer配置文件" :span="3">
        <pre>
          {{formatJson(desc.targetConfigureContent)}}
        </pre>
      </a-descriptions-item>
      <a-descriptions-item label="流程内容" :span="3">
        <pre>
          {{formatJson(desc.processContent)}}
        </pre>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
import config from '@/config/index'
import dateUtils from '@/utils/date'
import formatJson from '@/utils/json'
export default {
  data () {
    return {
      id: '',
      desc: ''
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.getDesc()
  },
  methods: {
    // 获取状态标签的颜色
    getStateColor (state) {
      return config.REPORT_STATE_MAP[state]
    },
    // 格式化时间
    formatDateTime (timeStamp) {
      return dateUtils.formatDateTime(timeStamp)
    },
    // 加密密码部分
    formatJson (content) {
      return formatJson(content)
    },
    // 获取任务报告详情
    async getDesc () {
      let res = await fetch.post('/getOneJobReport', {
        jobReportId: this.id
      })
      this.desc = res.data
      this.desc.sourceConfigureContent = JSON.parse(this.desc.sourceConfigureContent)
      console.log(this.desc.sourceConfigureContent.parameter.password)
      if (this.desc.sourceConfigureContent.parameter.password) {
        this.desc.sourceConfigureContent.parameter.password = '********'
      }
      this.desc.targetConfigureContent = JSON.parse(this.desc.targetConfigureContent)
      if (this.desc.targetConfigureContent.parameter.password) {
        this.desc.targetConfigureContent.parameter.password = '********'
      }
    }
  }
}

</script>

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
      <a-descriptions-item label="异常信息" style="color:red;">
        <span v-if="desc.throwable && desc.throwable.length > 10">
          {{desc.throwable.slice(0, 10) + '...'}}
          <a @click="showDetail(desc.throwable)">详情</a>
        </span>
        <span v-else>{{desc.throwable || '无'}}</span>
      </a-descriptions-item>
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
            <a-statistic title="成功读取数据量" :value="formatBytes(desc.readSucceedBytes)">
              <template v-slot:suffix>
                <span>Bytes</span>
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
            <a-statistic title="成功写入数据量" :value="formatBytes(desc.writeSucceedBytes)">
              <template v-slot:suffix>
                <span>Bytes</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-bottom:15px;">
          <a-col :span="6">
            <a-statistic title="输入ETL模块总记录数" :value="desc.totalInputEtlRecords">
              <template v-slot:suffix>
                <span>条</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="输出ETL模块总记录数" :value="desc.totalOutputEtlRecords">
              <template v-slot:suffix>
                <span>条</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="数据处理速度" :value="formatBytes(desc.averageByteSpeed)">
              <template v-slot:suffix>
                <span>Bytes/s</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="6">
            <a-statistic title="记录处理速度" :value="desc.averageRecordSpeed">
              <template v-slot:suffix>
                <span>条/秒</span>
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
import formatBytes from '@/utils/bytes'
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
    // 格式化字符
    formatJson (content) {
      return formatJson(content)
    },
    // 格式化字节
    formatBytes (B) {
      return formatBytes(B)
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
    },
    // 展示异常信息
    showDetail (info) {
      this.$confirm({
        title: '异常信息详情',
        content: info,
        okText: '确认',
        cancelText: '取消'
      })
    }
  }
}

</script>

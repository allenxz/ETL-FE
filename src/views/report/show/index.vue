<template>
  <div class="report-show">
    <a-table
      :columns="columns"
      :dataSource="data"
      rowKey="deploymentId">
      <span slot="state" slot-scope="state">
        <a-tag :color="getStateColor(state)">{{state}}</a-tag>
      </span>
      <span slot="recordTime" slot-scope="recordTime" :title="formatDateTime(recordTime)">
        {{formatDateTime(recordTime)}}
      </span>
      <span slot="action" slot-scope="row">
        <a-button type="primary"  size="small" @click="seeReport(row.jobReportId)" title="查看报告">
          <a-icon type="eye" />
        </a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
import config from '@/config/index'
import dateUtils from '@/utils/date'
export default {
  data () {
    return {
      columns: config.REPORT_COLUMNS,
      data: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50']
      }
    }
  },
  mounted () {
    this.getAllJobReports(this.pagination.pageSize, this.pagination.current)
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
    // 分页获取任务报告
    async getAllJobReports (pageSize, pageNumber) {
      let res = await fetch.post('/getAllJobReports', {
        pageSize,
        pageNumber
      })
      this.data = res.data.jobReportDesc
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    // 查看任务报告详情
    seeReport (id) {
      this.$router.push({ name: 'reportDetail', params: { id } })
    }
  }
}
</script>

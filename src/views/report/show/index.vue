<template>
  <div class="report-show">
    <a-checkbox @change="changeViewTarget">只看自己</a-checkbox>
    <a-table
      class="report-table"
      :columns="columns"
      :pagination="pagination"
      :dataSource="data"
      rowKey="jobReportId"
      @change="handleTableChange">
      <span slot="state" slot-scope="state">
        <a-tag :color="getStateColor(state)">{{state}}</a-tag>
      </span>
      <span slot="recordTime" slot-scope="recordTime" :title="formatDateTime(recordTime)">
        {{formatDateTime(recordTime)}}
      </span>
      <span slot="stopUserName" slot-scope="stopUserName">
        {{stopUserName || '无'}}
      </span>
      <span slot="action" slot-scope="row">
        <a-button type="primary"  size="small" @click="seeReport(row.jobReportId)" title="查看报告">
          <a-icon type="eye" />
        </a-button>
        <a-divider type="vertical" />
        <a-button :disabled="curUserName !==row.startUserName" type="primary"  size="small" @click="showMadal(row)" title="一键生成">
          <a-icon type="thunderbolt" />
        </a-button>
      </span>
    </a-table>
    <a-modal title="为生成的相关内容命名" v-model="visible" @ok="genAllThings" @cancel="hideModal">
      <a-input id="nameInput" v-model="inputName" placeholder="请填写输入配置名" allowClear></a-input>
      <a-input v-model="outputName" placeholder="请填写输出配置名" allowClear style="margin-top:15px;"></a-input>
      <a-input v-model="processName" placeholder="请填写数据处理流程名" allowClear style="margin-top:15px;"></a-input>
    </a-modal>
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
      },
      isViewSelf: false,
      getAllReportPath: '/getAllJobReports',
      curUserName: '',
      visible: false,
      inputName: '',
      outputName: '',
      processName: '',
      genRow: ''
    }
  },
  watch: {
    isViewSelf (newVal) {
      if (newVal) {
        this.getAllReportPath = '/getAllPrivateJobReports'
      } else {
        this.getAllReportPath = '/getAllJobReports'
      }
      this.getAllJobReports(this.pagination.pageSize, this.pagination.current)
    }
  },
  mounted () {
    let pagination = localStorage.getItem('pagination')
    if (pagination) {
      this.pagination = JSON.parse(pagination)
      localStorage.removeItem('pagination')
    }
    this.getAllJobReports(this.pagination.pageSize, this.pagination.current)
    this.getUserInformation()
  },
  methods: {
    // 获取当前用户名
    async getUserInformation () {
      let res = await fetch.post('/getUserInformation')
      this.curUserName = res.data.userInformation.userName
    },
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
      let res = await fetch.post(this.getAllReportPath, {
        pageSize,
        pageNumber
      })
      this.data = res.data.jobReportDesc
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    // 切换页码
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAllJobReports(this.pagination.pageSize, this.pagination.current)
    },
    // 查看任务报告详情
    seeReport (id) {
      localStorage.setItem('pagination', JSON.stringify(this.pagination))
      this.$router.push({ name: 'reportDetail', params: { id } })
    },
    // 切换查看的对象
    changeViewTarget (e) {
      this.isViewSelf = e.target.checked
    },
    // 显示命名框
    showMadal (row) {
      this.genRow = row
      this.visible = true
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    // 隐藏命名框
    hideModal () {
      this.inputName = ''
      this.outputName = ''
      this.processName = ''
      this.genRow = ''
    },
    // 生成报告中主体业务
    async genAllThings () {
      if (this.inputName === '' || this.outputName === '' || this.processName === '') {
        this.$message.error('命名不允许有空')
        return
      }
      let processRes = await fetch.post('/addProcess', {
        processName: this.processName,
        processContent: this.genRow.processContent
      })
      let inputRes = await fetch.post('/addConfigure', {
        configureName: this.inputName,
        configureType: this.genRow.sourceConfigureType,
        configureContent: this.genRow.sourceConfigureContent,
        configureStruct: this.genRow.sourceConfigureStruct
      })
      let outputRes = await fetch.post('/addConfigure', {
        configureName: this.outputName,
        configureType: this.genRow.targetConfigureType,
        configureContent: this.genRow.targetConfigureContent,
        configureStruct: this.genRow.targetConfigureStruct
      })
      if (processRes.data && inputRes.data && outputRes.data) {
        this.$message.success('任务报告中的相关内容全程成功生成')
        this.visible = false
      } else {
        this.$message.error('生成失败，请重新操作')
      }
    }
  }
}
</script>

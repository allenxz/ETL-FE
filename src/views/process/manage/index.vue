<template>
  <div class="process-manage">
    <div class="btn-group">
      <a-button type="primary">创建流程</a-button>
      <a-button type="danger">流程删除</a-button>
      <a-button>流程导入</a-button>
      <a-button>流程导出</a-button>
      <a-button>流程输出统计</a-button>
    </div>
    <div class="process-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="processId"
        :pagination="pagination"
        :rowSelection="rowSelection"
        @change="handleTableChange">
        <span slot="state" slot-scope="state">
          <a-tag :color="getStateColor(state)">{{state}}</a-tag>
        </span>
        <span slot="updateTime" slot-scope="updateTime">
          {{formatDateTime(updateTime)}}
        </span>
        <span slot="action">
          <a href="javascript:;">
            <a-icon type="edit" />
            编辑
          </a>
          <a-divider type="vertical" />
          <a href="javascript:;" style="color:red;">
            <a-icon type="delete" />
            删除
          </a>
          <a-divider type="vertical" />
          <a href="javascript:;">
            <a-icon type="copy" />
            复制
          </a>
        </span>
      </a-table>
    </div>
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
      columns: config.PROCESS_COLUMNS,
      data: [],
      selectedRowKeys: [],
      rowSelection: {
        onChange: this.onSelectChange
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50']
      }
    }
  },
  mounted () {
    this.getAllProcess(this.pagination.pageSize, this.pagination.current)
  },
  methods: {
    getStateColor (state) {
      return config.PROCESS_STATE_MAP[state]
    },
    formatDateTime (timeStamp) {
      return dateUtils.formatDateTime(timeStamp)
    },
    async getAllProcess (pageSize, pageNumber) {
      let res = await fetch.post('/getAllProcess', {
        pageSize,
        pageNumber
      })
      this.data = res.data.processDesc
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAllProcess(this.pagination.pageSize, this.pagination.current)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

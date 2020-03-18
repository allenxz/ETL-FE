<template>
  <div class="process-manage">
    <div class="btn-group">
      <a-button type="primary">
        <router-link to="/process-add">创建流程</router-link>
      </a-button>
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
        <span slot="action" slot-scope="row">
          <a href="javascript:;">
            <a-icon type="edit" />
            编辑
          </a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该流程?"
            @confirm="confirmDelete(row.processId)"
            okText="是"
            cancelText="否">
            <a href="javascript:;" style="color:red;">
              <a-icon type="delete" />
              删除
            </a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="showNameModal(row.processId)">
            <a-icon type="copy" />
            复制
          </a>
        </span>
      </a-table>
      <a-modal title="为拷贝的新流程命名" v-model="visible" @ok="copyProcess">
        <a-input id="nameInput" v-model="newProcessName" placeholder="请输入..." allowClear></a-input>
      </a-modal>
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
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '20', '50']
      },
      visible: false,
      newProcessName: '',
      copyedProcessId: ''
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
    },
    async confirmDelete (processId) {
      let res = await fetch.post('/deleteProcess', {
        processId
      })
      this.$message.success(res.data.message)
      this.getAllProcess(this.pagination.pageSize, this.pagination.current)
    },
    showNameModal (processId) {
      this.visible = true
      this.copyedProcessId = processId
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    async copyProcess () {
      let res = await fetch.post('/copyProcess', {
        newProcessName: this.newProcessName,
        processId: this.copyedProcessId
      })
      if (!res.exception) {
        this.$message.success(res.data.message)
        this.visible = false
        this.getAllProcess(this.pagination.pageSize, this.pagination.current)
      } else {
        this.$message.error(res.exception)
      }
      this.newProcessName = ''
    }
  }
}
</script>

<template>
  <div class="process-manage">
    <div class="btn-group">
      <a-button type="primary">
        <router-link :to="{name: 'processEditer'}">创建流程</router-link>
      </a-button>
      <a-popconfirm
        title="确定删除这些流程?"
        @confirm="deleteProcesses"
        okText="是"
        cancelText="否">
        <a-button type="danger">流程删除</a-button>
      </a-popconfirm>
      <a-button @click="exportProcess">流程导出</a-button>
      <a-upload
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        >
        <a-button>流程导入</a-button>
      </a-upload>
      <a-checkbox @change="changeViewTarget">只看自己</a-checkbox>
    </div>
    <div class="process-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="processId"
        :pagination="pagination"
        :rowSelection="rowSelection"
        @change="handleTableChange">
        <span slot="processName" slot-scope="row">
          <a @click="preview(row)">{{row.processName}}</a>
        </span>
        <span slot="state" slot-scope="state">
          <a-tag :color="getStateColor(state)">{{state}}</a-tag>
        </span>
        <span slot="updateTime" slot-scope="updateTime" :title="formatDateTime(updateTime)">
          {{formatDateTime(updateTime)}}
        </span>
        <span slot="action" slot-scope="row">
          <a-button type="dashed"  size="small" :disabled="row.state === '运行中'"  @click="edit(row.processId)">
            <a-icon type="edit" />
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-button type="dashed"  size="small" @click="showNameModal(row.processId)">
            <a-icon type="copy" />
            复制
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该流程?"
            @confirm="confirmDelete(row.processId)"
            :disabled="row.state === '运行中'"
            okText="是"
            cancelText="否">
            <a-button type="danger"  size="small" :disabled="row.state === '运行中'">
              <a-icon type="delete" />
              删除
            </a-button>
          </a-popconfirm>
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
      rowSelection: {
        selectedRowKeys: [],
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
      copyedProcessId: '',
      isViewSelf: false,
      getAllProcessPath: '/getAllProcess'
    }
  },
  mounted () {
    let pagination = localStorage.getItem('pagination')
    if (pagination) {
      this.pagination = JSON.parse(pagination)
      localStorage.removeItem('pagination')
    }
    this.getAllProcess(this.pagination.pageSize, this.pagination.current)
  },
  watch: {
    isViewSelf (newVal) {
      if (newVal) {
        this.getAllProcessPath = '/getAllPrivateProcess'
      } else {
        this.getAllProcessPath = '/getAllProcess'
      }
      this.getAllProcess(this.pagination.pageSize, this.pagination.current)
    }
  },
  methods: {
    // 获取状态标签的颜色
    getStateColor (state) {
      return config.PROCESS_STATE_MAP[state]
    },
    // 格式化时间
    formatDateTime (timeStamp) {
      return dateUtils.formatDateTime(timeStamp)
    },
    // 获取指定页数，页码的流程
    async getAllProcess (pageSize, pageNumber) {
      let res = await fetch.post(this.getAllProcessPath, {
        pageSize,
        pageNumber
      })
      this.data = res.data.processDesc
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    // 切换页码
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAllProcess(this.pagination.pageSize, this.pagination.current)
    },
    // 批量选取流程
    onSelectChange (selectedRowKeys) {
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
    // 二次确认删除
    async confirmDelete (processId) {
      let hasPermission = await this.checkPermission(processId)
      if (!hasPermission) {
        return
      }
      let res = await fetch.post('/deleteProcess', {
        processId
      })
      if (res.data) {
        this.$message.success(res.data.message)
        this.getAllProcess(this.pagination.pageSize, this.pagination.current)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 展示复制流程命名对话框
    showNameModal (processId) {
      this.visible = true
      this.copyedProcessId = processId
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    // 复制流程
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
    },
    // 判断是否选择表格项
    isSelectItem () {
      if (this.rowSelection.selectedRowKeys.length === 0) {
        this.$message.error('请先选择表格项，再进行此操作')
        return false
      } else {
        return true
      }
    },
    // 批量删除
    async deleteProcesses () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/batchDeleteProcess', {
          processIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        if (res.data) {
          this.$message.success(res.data.message)
          this.rowSelection.selectedRowKeys = []
          this.getAllProcess(this.pagination.pageSize, this.pagination.current)
        } else {
          this.$message.error(res.exception)
        }
      }
    },
    // 导出流程
    async exportProcess () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/exportProcess', {
          processIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        if (res.data) {
          this.saveJSON(res.data.contents)
          this.rowSelection.selectedRowKeys = []
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.exception)
        }
      }
    },
    // 保存数据到JSON
    saveJSON (data) {
      if (!data) {
        this.$message.error('导出数据为空')
        return
      }
      let filename = 'process-' + this.formatDateTime(Date.now()) + '.json'
      let blob = new Blob([data], { type: 'text/json' })
      let e = document.createEvent('MouseEvents')
      let a = document.createElement('a')
      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    // 上传文件
    beforeUpload (file) {
      if (file.type !== 'application/json') {
        this.$message.error('请选择JSON文件进行导入')
        return
      }
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        let data = JSON.parse(reader.result)
        fetch.post('/importProcess', {
          processes: JSON.stringify(data)
        }).then(res => {
          this.$message.success(res.data.message)
          this.getAllProcess(this.pagination.pageSize, this.pagination.current)
        })
      }
      return false
    },
    // 校验权限
    async checkPermission (processId) {
      let res = await fetch.post('/checkProcessPermission', {
        processId
      })
      if (res.data.message === 'true') {
        return true
      } else {
        this.$message.error('只有创建者才能操作自己的流程，你没有相关权限')
        return false
      }
    },
    // 编辑
    async edit (id) {
      let hasPermission = await this.checkPermission(id)
      if (!hasPermission) {
        return
      }
      this.$router.push({ name: 'processEditer', params: { id } })
    },
    // 切换查看的对象
    changeViewTarget (e) {
      this.isViewSelf = e.target.checked
    },
    // 预览
    preview (row) {
      localStorage.setItem('pagination', JSON.stringify(this.pagination))
      this.$router.push({ name: 'preview', params: { id: row.processId, type: 'process' } })
    }
  }
}
</script>

<template>
  <div class="permission-approval">
    <div class="process-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="processId"
        :pagination="pagination">
        <span slot="sendTime" slot-scope="sendTime" :title="formatDateTime(sendTime)">
          {{formatDateTime(sendTime)}}
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
      columns: config.PERMISSION_COLUMNS,
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
    this.getAllAuthorizeNotices(this.pagination.pageSize, this.pagination.current)
  },
  methods: {
    // 格式化时间
    formatDateTime (timeStamp) {
      return dateUtils.formatDateTime(timeStamp)
    },
    // 获取指定页数，页码的权限通知
    async getAllAuthorizeNotices (pageSize, pageNumber) {
      let res = await fetch.post('/getAllPrivateAuthorizeNotices', {
        pageSize,
        pageNumber
      })
      this.data = res.data.noticesDesc
      this.pagination.total = res.data.totalPages * res.data.pageSize
    }
  }
}

</script>

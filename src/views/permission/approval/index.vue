<template>
  <div class="permission-approval">
    <div class="process-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="noticeId"
        :pagination="pagination">
        <span slot="deploymentName" slot-scope="row">
            <a @click="preview(row.deploymentId, 'deployment')">{{row.deploymentName}}</a>
          </span>
        <span slot="sendTime" slot-scope="sendTime" :title="formatDateTime(sendTime)">
          {{formatDateTime(sendTime)}}
        </span>
        <span slot="action" slot-scope="row">
          <a-popconfirm
            title="确定同意该审批?"
            @confirm="confirmAllow(row.noticeId)"
            okText="是"
            cancelText="否">
            <a-button type="primary"  size="small">
              <a-icon type="check" />
              同意
            </a-button>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定拒绝该审批?"
            @confirm="confirmReject(row.noticeId)"
            okText="是"
            cancelText="否">
            <a-button type="danger"  size="small">
              <a-icon type="close" />
              拒绝
            </a-button>
          </a-popconfirm>
        </span>
        <p slot="expandedRowRender" slot-scope="record">
          <font-awesome-icon :icon="['fas', 'info-circle']" style="margin-right:5px;"/>
          {{record.content}}
        </p>
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
    let pagination = localStorage.getItem('pagination')
    if (pagination) {
      this.pagination = JSON.parse(pagination)
      localStorage.removeItem('pagination')
    }
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
      console.log(this.data)
      this.data = this.data.filter(item => item.noticeType === 'authorizeRequest')
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    // 确认同意申请
    async confirmAllow (noticeId) {
      let res = await fetch.post('/authorizeAllow', {
        noticeId
      })
      if (res.data) {
        this.$message.success(res.data.message)
        await fetch.post('/deleteNotice', {
          noticeId
        })
        history.go(0)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 确认拒绝申请
    async confirmReject (noticeId) {
      let res = await fetch.post('/authorizeReject', {
        noticeId
      })
      if (res.data) {
        this.$message.success(res.data.message)
        await fetch.post('/deleteNotice', {
          noticeId
        })
        history.go(0)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 预览
    preview (id, type) {
      localStorage.setItem('pagination', JSON.stringify(this.pagination))
      this.$router.push({ name: 'preview', params: { id, type } })
    }
  }
}

</script>

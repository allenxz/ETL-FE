<template>
  <div class="config-manage">
    <div class="btn-group">
      <a-button type="primary">
        新建配置
      </a-button>
      <a-button type="danger">删除配置</a-button>
      <a-button>配置导入</a-button>
      <a-button>配置导出</a-button>
    </div>
    <div class="config-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="configureId"
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
          <router-link :to="{name: 'processEditer', params:{id: row.configureId}}">
            <a-icon type="edit" />
            编辑
          </router-link>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该配置?"
            @confirm="confirmDelete(row.configureId)"
            okText="是"
            cancelText="否">
            <a href="javascript:;" style="color:red;">
              <a-icon type="delete" />
              删除
            </a>
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
      columns: config.CONFIG_COLUMNS,
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
      }
    }
  },
  mounted () {
    this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
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
    async getAllConfigures (pageSize, pageNumber) {
      let res = await fetch.post('/getAllConfigures', {
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
      this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
    },
    // 批量选取配置
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

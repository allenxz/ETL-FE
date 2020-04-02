<template>
  <div class="deployment-manage">
      <div class="btn-group">
        <a-button type="primary">
          <router-link :to="{name: 'deploymentEditer'}">创建部署</router-link>
        </a-button>
        <a-popconfirm
          title="确定删除这些部署?"
          @confirm="deleteDeployments"
          okText="是"
          cancelText="否">
          <a-button type="danger">部署删除</a-button>
        </a-popconfirm>
      </div>
      <div class="deployment-table">
        <a-table
          :columns="columns"
          :dataSource="data"
          rowKey="deploymentId"
          :pagination="pagination"
          :rowSelection="rowSelection"
          @change="handleTableChange">
          <span slot="state" slot-scope="state">
            <a-tag :color="getStateColor(state)">{{state}}</a-tag>
          </span>
          <span slot="deploymentId" slot-scope="deploymentId">
            {{formatID(deploymentId)}}
          </span>
          <span slot="sourceConfigureId" slot-scope="sourceConfigureId">
            {{formatID(sourceConfigureId)}}
          </span>
          <span slot="targetConfigureId" slot-scope="targetConfigureId">
            {{formatID(targetConfigureId)}}
          </span>
          <span slot="processIds" slot-scope="processIds">
            {{formatID(processIds)}}
          </span>
          <span slot="updateTime" slot-scope="updateTime">
            {{formatDateTime(updateTime)}}
          </span>
          <span slot="action" slot-scope="row">
            <router-link :to="{name: 'processEditer', params:{id: row.deploymentId}}">
              <a-icon type="edit" />
              编辑
            </router-link>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除该流程?"
              @confirm="confirmDelete(row.deploymentId)"
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
      columns: config.DEPLOYMENT_COLUMNS,
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
      }
    }
  },
  mounted () {
    this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
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
    // 格式化ID
    formatID (id) {
      if (!id) {
        return
      }
      return id.slice(0, 6)
    },
    // 获取指定页数，页码的部署
    async getAllDeployments (pageSize, pageNumber) {
      let res = await fetch.post('/getAllDeployments', {
        pageSize,
        pageNumber
      })
      this.data = res.data.deployDesc
      console.log(this.data)
      this.pagination.total = res.data.totalPages * res.data.pageSize
    },
    // 切换页码
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
    },
    // 批量选取流程
    onSelectChange (selectedRowKeys) {
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
    // 二次确认删除
    async confirmDelete (deploymentId) {
      let res = await fetch.post('/deleteDeployment', {
        deploymentId
      })
      this.$message.success(res.data.message)
      this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
    },
    // 判断是否选择表格项
    isSelectItem () {
      if (this.rowSelection.selectedRowKeys.length === 0) {
        this.$message.error('请先选择表格项，在进行此操作')
        return false
      } else {
        return true
      }
    },
    // 批量删除
    async deleteDeployments () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/batchDeleteDeployment', {
          deploymentIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        this.$message.success(res.data.message)
        this.rowSelection.selectedRowKeys = []
        this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
      }
    }
  }
}

</script>

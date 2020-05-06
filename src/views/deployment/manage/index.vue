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
        <a-checkbox @change="changeViewTarget">只看自己</a-checkbox>
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
          <span slot="input" slot-scope="row">
            <a @click="preview(row.sourceConfigureId, 'configure')">{{row.sourceConfigureName}}</a>
          </span>
          <span slot="output" slot-scope="row">
            <a @click="preview(row.targetConfigureId, 'configure')">{{row.targetConfigureName}}</a>
          </span>
          <span slot="processName" slot-scope="row">
            <a @click="preview(row.processId, 'process')">{{row.processName}}</a>
          </span>
          <span slot="updateTime" slot-scope="updateTime" :title="formatDateTime(updateTime)">
            {{formatDateTime(updateTime)}}
          </span>
          <span slot="action" slot-scope="row">
            <a-button type="dashed"  size="small" :disabled="row.state === '运行中'"  @click="edit(row.deploymentId)" title="编辑部署">
              <a-icon type="edit" />
            </a-button>
            <a-divider type="vertical" />
            <a-button type="dashed"  size="small" :disabled="row.state === '运行中'" @click="startDeployment(row.deploymentId)" title="启动部署">
              <a-icon type="play-circle" />
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              :disabled="row.state === '停止'"
              title="确定暂停该部署?"
              @confirm="stopDeployment(row.deploymentId)"
              okText="是"
              cancelText="否">
              <a-button type="danger"  size="small" :disabled="row.state === '停止'" title="暂停部署">
                <a-icon type="pause-circle" />
              </a-button>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定删除该部署?"
              :disabled="row.state === '运行中'"
              @confirm="confirmDelete(row.deploymentId)"
              okText="是"
              cancelText="否">
              <a-button type="danger"  size="small" :disabled="row.state === '运行中'" title="删除部署">
                <a-icon type="delete" />
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
      },
      isViewSelf: false,
      getAllDeploymentsPath: '/getAllDeployments'
    }
  },
  mounted () {
    let pagination = localStorage.getItem('pagination')
    if (pagination) {
      this.pagination = JSON.parse(pagination)
      localStorage.removeItem('pagination')
    }
    this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
  },
  watch: {
    isViewSelf (newVal) {
      if (newVal) {
        this.getAllDeploymentsPath = '/getAllPrivateDeployments'
      } else {
        this.getAllDeploymentsPath = '/getAllDeployments'
      }
      this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
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
    // 获取指定页数，页码的部署
    async getAllDeployments (pageSize, pageNumber) {
      let res = await fetch.post(this.getAllDeploymentsPath, {
        pageSize,
        pageNumber
      })
      this.data = res.data.deployDesc
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
      let hasPermission = await this.checkPermission(deploymentId)
      if (hasPermission !== true) {
        this.$message.error('只有创建者才能操作自己的部署，你没有相关权限')
        return
      }
      let res = await fetch.post('/deleteDeployment', {
        deploymentId
      })
      this.$message.success(res.data.message)
      this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
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
    async deleteDeployments () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/batchDeleteDeployment', {
          deploymentIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        if (res.data) {
          this.$message.success(res.data.message)
          this.rowSelection.selectedRowKeys = []
          this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
        } else {
          this.$message.error(res.exception)
        }
      }
    },
    // 启动部署
    async startDeployment (deploymentId) {
      const _this = this
      let hasPermission = await this.checkPermission(deploymentId)
      if (!hasPermission) {
        _this.$confirm({
          content: '你没有权限启动该部署，是否申请操作权限',
          async onOk () {
            let request = await fetch.post('/authorizeRequest', {
              deploymentId
            })
            if (request.data) {
              _this.$message.success(request.data.message)
            } else {
              _this.$message.error(request.exception)
            }
          },
          okText: '是',
          cancelText: '否'
        })
        return
      } else if (hasPermission !== true) {
        _this.$message.error(hasPermission)
        return
      }
      let res = await fetch.post('/startDeployment', {
        deploymentId
      })
      if (res.exception) {
        this.$message.error(res.exception)
      } else {
        this.$message.success(res.data.message)
        this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
      }
    },
    // 暂停部署
    async stopDeployment (deploymentId) {
      const _this = this
      let hasPermission = await this.checkPermission(deploymentId)
      if (!hasPermission) {
        _this.$confirm({
          content: '你没有权限暂停该部署，是否申请操作权限',
          async onOk () {
            let request = await fetch.post('/authorizeRequest', {
              deploymentId
            })
            if (request.data) {
              _this.$message.success(request.data.message)
            } else {
              _this.$message.error(request.exception)
            }
          },
          okText: '是',
          cancelText: '否'
        })
        return
      } else if (hasPermission !== true) {
        _this.$message.error(hasPermission)
        return
      }
      let res = await fetch.post('/stopDeployment', {
        deploymentId
      })
      if (res.exception) {
        this.$message.error(res.exception)
      } else {
        this.$message.success(res.data.message)
        this.getAllDeployments(this.pagination.pageSize, this.pagination.current)
      }
    },
    // 校验权限
    async checkPermission (deploymentId) {
      let res = await fetch.post('/checkDeploymentPermission', {
        deploymentId
      })
      if (res.data.message === 'true') {
        return true
      } else if (res.data.message === 'false') {
        return false
      } else {
        return res.data.message
      }
    },
    // 编辑
    async edit (id) {
      let hasPermission = await this.checkPermission(id)
      if (hasPermission !== true) {
        this.$message.error('只有创建者才能操作自己的部署，你没有相关权限')
        return
      }
      this.$router.push({ name: 'deploymentEditer', params: { id } })
    },
    // 切换查看的对象
    changeViewTarget (e) {
      this.isViewSelf = e.target.checked
    },
    // 预览
    preview (id, type) {
      localStorage.setItem('pagination', JSON.stringify(this.pagination))
      this.$router.push({ name: 'preview', params: { id, type } })
    }
  }
}

</script>

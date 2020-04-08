<template>
  <div class="config-manage">
    <div class="btn-group">
      <a-dropdown placement="bottomLeft" :trigger="['click']">
        <a-button>新建配置</a-button>
        <a-menu slot="overlay" mode="vertical" @click="createConfig">
          <a-sub-menu key="reader">
            <span slot="title">
              <font-awesome-icon :icon="['fas', 'file-import']" style="margin-right:5px;" />
              <span>reader</span>
            </span>
            <a-menu-item v-for="item of configType.reader" :key="item.name">
              {{item.name}}
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="writer">
            <span slot="title">
              <font-awesome-icon :icon="['fas', 'file-export']" style="margin-right:5px;" />
              <span>writer</span>
            </span>
            <a-menu-item v-for="item of configType.writer" :key="item.name">
              {{item.name}}
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-dropdown>
      <a-popconfirm
        title="确定删除这些配置?"
        @confirm="deleteConfigure"
        okText="是"
        cancelText="否">
        <a-button type="danger">删除配置</a-button>
      </a-popconfirm>
      <a-button @click="exportConfigure">配置导出</a-button>
      <a-upload
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        >
        <a-button>配置导入</a-button>
      </a-upload>
      <a-checkbox @change="changeViewTarget">只看自己</a-checkbox>
    </div>
    <div class="config-table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="configureId"
        :pagination="pagination"
        :rowSelection="rowSelection"
        @change="handleTableChange">
        <span slot="configureName" slot-scope="row">
          <router-link :to="{name: 'preview', params:{id: row.configureId, type: 'configure'}}">
            {{row.configureName}}
          </router-link>
        </span>
        <span slot="state" slot-scope="state">
          <a-tag :color="getStateColor(state)">{{state}}</a-tag>
        </span>
        <span slot="updateTime" slot-scope="updateTime" :title="formatDateTime(updateTime)">
          {{formatDateTime(updateTime)}}
        </span>
        <span slot="action" slot-scope="row">
          <a-button type="dashed"  size="small" :disabled="row.state === '使用中'"  @click="editConfig(row.configureId,row.configureType)">
            <a-icon type="edit" />
            编辑
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除该配置?"
            @confirm="confirmDelete(row.configureId)"
            :disabled="row.state === '使用中'"
            okText="是"
            cancelText="否">
            <a-button type="danger"  size="small" :disabled="row.state === '使用中'">
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
import configType from '../cofigType'
import fetch from '@/services/fetch'
import config from '@/config/index'
import dateUtils from '@/utils/date'
export default {
  data () {
    return {
      columns: config.CONFIG_COLUMNS,
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
      configType,
      isViewSelf: false,
      getAllConfiguresPath: '/getAllConfigures'
    }
  },
  mounted () {
    this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
  },
  watch: {
    isViewSelf (newVal) {
      if (newVal) {
        this.getAllConfiguresPath = '/getAllPrivateConfigures'
      } else {
        this.getAllConfiguresPath = '/getAllConfigures'
      }
      this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
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
    async getAllConfigures (pageSize, pageNumber) {
      let res = await fetch.post(this.getAllConfiguresPath, {
        pageSize,
        pageNumber
      })
      this.data = res.data.confDesc
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
      this.rowSelection.selectedRowKeys = selectedRowKeys
    },
    // 新建配置
    createConfig ({ item, key, keyPath }) {
      let path = '/' + key
      this.$router.push({ path })
    },
    // 编辑配置
    async editConfig (configureId, configureType) {
      let hasPermission = await this.checkPermission(configureId)
      if (!hasPermission) {
        return
      }
      let id = configureId
      if (configureType === 'mysqlreader') {
        this.$router.push({ name: 'mysqlReader', params: { id } })
      } else if (configureType === 'mongodbreader') {
        this.$router.push({ name: 'mongodbReader', params: { id } })
      } else if (configureType === 'hdfsreader') {
        this.$router.push({ name: 'HDFSReader', params: { id } })
      } else if (configureType === 'mysqlwriter') {
        this.$router.push({ name: 'mysqlWriter', params: { id } })
      } else if (configureType === 'mongodbwriter') {
        this.$router.push({ name: 'mongodbWriter', params: { id } })
      } else if (configureType === 'hdfswriter') {
        this.$router.push({ name: 'hdfsWriter', params: { id } })
      }
    },
    // 二次确认删除
    async confirmDelete (configureId) {
      let hasPermission = await this.checkPermission(configureId)
      if (!hasPermission) {
        return
      }
      let res = await fetch.post('/deleteConfigure', {
        configureId
      })
      this.$message.success(res.data.message)
      this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
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
    async deleteConfigure () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/batchDeleteConfigure', {
          configureIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        if (res.data) {
          this.$message.success(res.data.message)
          this.rowSelection.selectedRowKeys = []
          this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
        } else {
          this.$message.error(res.exception)
        }
      }
    },
    // 导出配置
    async exportConfigure () {
      if (this.isSelectItem()) {
        let res = await fetch.post('/exportConfigure', {
          configureIds: JSON.stringify(this.rowSelection.selectedRowKeys)
        })
        this.saveJSON(res.data.contents)
        this.rowSelection.selectedRowKeys = []
      }
    },
    // 保存数据到JSON
    saveJSON (data) {
      if (!data) {
        this.$message.error('导出数据为空')
        return
      }
      let filename = 'configure-' + this.formatDateTime(Date.now()) + '.json'
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
        fetch.post('/importConfigure', {
          configures: JSON.stringify(data)
        }).then(res => {
          this.$message.success(res)
          this.getAllConfigures(this.pagination.pageSize, this.pagination.current)
        })
      }
      return false
    },
    // 校验权限
    async checkPermission (configureId) {
      let res = await fetch.post('/checkConfigurePermission', {
        configureId
      })
      if (res.data.message === 'true') {
        return true
      } else {
        this.$message.error('只有创建者才能操作自己的配置文件，你没有相关权限')
        return false
      }
    },
    // 切换查看的对象
    changeViewTarget (e) {
      this.isViewSelf = e.target.checked
    }
  }
}
</script>

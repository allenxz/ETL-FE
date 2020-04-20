<template>
  <div class="permission-record">
    <a-tabs defaultActiveKey='1' v-model="activeKey">
      <a-tab-pane key="1">
        <span slot="tab">
          <font-awesome-icon :icon="['fas', 'user-check']" />
          我批准的所有授权
        </span>
        <a-empty v-if="list.length === 0" style="padding:50px 0;"/>
        <a-collapse :activeKey="['0']">
          <a-collapse-panel :key="index" v-for="(item, index) of list">
            <span slot="header">
              <span>部署名 : {{item.deploymentName}}</span>
            </span>
            <a-icon slot="extra" type="ellipsis" @click="preview(item.deploymentId, 'deployment')" />
            <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :dataSource="item.content">
              <a-list-item slot="renderItem" slot-scope="listItem">
                <a-card>
                  <a-card-meta :title="listItem.userName">
                    <a-avatar
                      slot="avatar"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  </a-card-meta>
                  <template class="ant-card-actions" slot="actions">
                    <a-popconfirm
                      title="确定取消对该用户的授权?"
                      @confirm="cancelAuthorize(listItem.userId, item.deploymentId)"
                      okText="是"
                      cancelText="否">
                      <a-icon type="stop" key="stop" title="取消授权" />
                    </a-popconfirm>
                  </template>
                </a-card>
              </a-list-item>
            </a-list>
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <font-awesome-icon :icon="['fas', 'user-tag']" />
          我拥有的所有授权
        </span>
        <a-table
          :columns="columns"
          :dataSource="data"
          rowKey="deploymentId"
          :pagination="false">
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
              @confirm="confirmDelete(row.deploymentId)"
              okText="是"
              cancelText="否">
              <a-button type="danger"  size="small" :disabled="row.state === '运行中'" title="删除部署">
                <a-icon type="delete" />
              </a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
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
      columns: config.AUTHORIZED_DEPLOYMENT_COLUMNS,
      data: [],
      list: [],
      activeKey: '1'
    }
  },
  mounted () {
    let activeKey = localStorage.getItem('activeKey')
    if (activeKey) {
      this.activeKey = JSON.parse(activeKey)
      localStorage.removeItem('activeKey')
    }
    this.getUserAuthorizedDeployments()
    this.getDeploymentPermissionUserSituation()
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
    // 获取用户被授权的部署信息
    async getUserAuthorizedDeployments () {
      let res = await fetch.post('/getUserAuthorizedDeployments')
      this.data = res.data.deployDesc
    },
    // 获得用户批准的所有部署信息
    async getDeploymentPermissionUserSituation () {
      let res = await fetch.post('/getDeploymentPermissionUserSituation')
      this.list = res.data.situation
    },
    // 预览
    preview (id, type) {
      localStorage.setItem('activeKey', JSON.stringify(this.activeKey))
      this.$router.push({ name: 'preview', params: { id, type } })
    },
    // 取消授权
    async cancelAuthorize (userId, deploymentId) {
      let res = await fetch.post('/cancelAuthorize', {
        userId,
        deploymentId
      })
      if (res.data) {
        this.$message.success(res.data.message)
        this.getDeploymentPermissionUserSituation()
      } else {
        this.$message.error(res.exception)
      }
    }
  }
}
</script>

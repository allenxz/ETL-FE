<template>
  <div class="bell">
    <a-dropdown :trigger="['click']" placement="bottomRight" v-model="visible">
      <a-badge :count="count" :offset="[3,-4]">
        <a-icon class="icon" type="bell" />
      </a-badge>
      <a-menu slot="overlay" style="padding:0;">
        <a-list itemLayout="horizontal" :dataSource="data" style="padding:0 10px;">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta
              :description="formatDateTime(item.sendTime)"
            >
              <a slot="title" @click="goto(item.noticeType, item.noticeId)">{{item.content}}</a>
              <a-avatar
                slot="avatar"
                :src="getIconUrl(item.noticeType)"/>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-menu-item @click="askIfClear" v-if="count !== 0" block style="text-align:center;">清空通知</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import fetch from '@/services/fetch'
import dateUtils from '@/utils/date'
export default {
  data () {
    return {
      count: 0,
      data: [],
      visible: false
    }
  },
  mounted () {
    const _this = this
    _this.getNotices()
    _this.updateReport()
    // 轮询获取消息
    setInterval(function () {
      _this.updateReport()
      _this.getNotices()
    }, 10000)
  },
  methods: {
    // 更新报告
    async updateReport () {
      await fetch.post('/getRunningDeployments')
    },
    // 获得icon在图床上的映射
    getIconUrl (noticeType) {
      const map = {
        'authorizeAllow': 'https://s1.ax1x.com/2020/04/09/G5y0nx.png',
        'authorizeReject': 'https://s1.ax1x.com/2020/04/09/G5yYh4.png',
        'authorizeRequest': 'https://s1.ax1x.com/2020/04/09/G5yJNF.png',
        'cancelAuthorize': 'https://s1.ax1x.com/2020/04/09/G5yGAU.png'
      }
      return map[noticeType]
    },
    // 格式化时间
    formatDateTime (timeStamp) {
      return dateUtils.formatDateTime(timeStamp)
    },
    // 获取所有权限通知信息
    async getNotices () {
      let res = await fetch.post('/getAllPrivateAuthorizeNotices')
      this.data = res.data.noticesDesc
      this.count = this.data.length
    },
    // 根据消息类型，跳转页面
    async goto (noticeType, noticeId) {
      if (noticeType === 'authorizeRequest') {
        this.$router.push({ path: '/permission-approval' })
      } else {
        localStorage.setItem('activeKey', JSON.stringify('2'))
        this.$router.push({ path: '/permission-record' })
        await fetch.post('/deleteNotice', {
          noticeId
        })
        this.getNotices()
      }
      this.visible = false
    },
    // 询问是否删除
    askIfClear () {
      const _this = this
      this.visible = false
      this.$confirm({
        content: '确认清空通知？',
        onOk () {
          _this.clearAllNotices()
        },
        okText: '是',
        cancelText: '否'
      })
    },
    // 清空所有通知
    async clearAllNotices () {
      let noticeIds = []
      this.data.forEach(i => {
        noticeIds.push(i.noticeId)
      })
      let res = await fetch.post('/batchDeleteNotice', {
        noticeIds: JSON.stringify(noticeIds)
      })
      if (res.data) {
        this.$message.success(res.data.message)
        this.getNotices()
      } else {
        this.$message.error(res.exception)
      }
    }
  }
}
</script>

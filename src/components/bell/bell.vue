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
        <a-button v-if="count !== 0" block>清空通知</a-button>
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
      data: {},
      visible: false
    }
  },
  mounted () {
    const _this = this
    _this.getNotices()
    // 轮询获取消息
    setInterval(function () {
      _this.getNotices()
    }, 10000)
  },
  methods: {
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
        this.$router.push({ path: '/permission-record' })
        await fetch.post('/deleteNotice', {
          noticeId
        })
        this.getNotices()
      }
      this.visible = false
    },
    // 清空所有通知
    clearAllNotices () {}
  }
}
</script>

<template>
  <div class="personal-homepage">
    <a-row :gutter="16">
      <a-col :span="6">
        <div class="left">
          <div class="avatar-wrapper">
            <a-avatar :size="80" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
          </div>
          <h1>{{}}</h1>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="right">col-6</div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      info: {}
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      let res = await fetch.post('/getUserInformation')
      if (res.data) {
        this.info = res.data.userInformation
        console.log(this.info)
      } else {
        console.error('用户信息获取失败')
      }
    }
  }
}

</script>

<template>
  <div class="avatar">
    <a-dropdown>
      <div>
        <span class="img">
          <a-avatar :size="24" :src="avatar" />
        </span>
        <span class="text">
          {{text}}
        </span>
      </div>
      <a-menu slot="overlay" @click="onClick">
        <a-menu-item key="1"><a-icon type="user" />个人中心</a-menu-item>
        <a-menu-item key="2"><a-icon type="setting" />个人设置</a-menu-item>
        <a-menu-divider />
        <a-menu-item key="3"><a-icon type="logout" />退出登录</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      text: 'allen tan',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      isLogin: false
    }
  },
  methods: {
    onClick ({ key }) {
      switch (key) {
        case '1':
          break
        case '2':
          break
        case '3':
          this.logout()
          break
      }
    },
    async logout () {
      let res = await fetch.post('/logout')
      console.log(res)
    }
  }
}
</script>

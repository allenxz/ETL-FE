<template>
  <a-layout id="home">
    <sider :collapsed="collapsed"></sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <HeaderMenu></HeaderMenu>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import './style.scss'
import Sider from '@/components/sider'
import HeaderMenu from '@/components/header-menu'
export default {
  name: 'home',
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    Sider,
    HeaderMenu
  }
}
</script>

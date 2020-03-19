<template>
  <a-layout id="home">
    <sider :collapsed="collapsed"></sider>
    <a-layout>
      <a-layout-header class="app-wrapper" style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <HeaderMenu></HeaderMenu>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 20px', background: '#f0f2f5', minHeight: '280px' }">
        <Breadcrumb></Breadcrumb>
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">
        ETL数据平台 ©2020 Created by Allen & KM
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import './style.scss'
import Sider from '@/components/sider'
import HeaderMenu from '@/components/header-menu'
import Breadcrumb from '@/components/breadcrumb'
export default {
  name: 'home',
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    Sider,
    HeaderMenu,
    Breadcrumb
  }
}
</script>

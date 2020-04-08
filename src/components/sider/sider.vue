<template>
  <a-layout-sider :trigger="null" collapsible v-model="collapsed" class="sider">
    <div class="logo-wrapper">
      <img src="../../../public/logo.png" alt="logo">
    </div>
    <h2 v-if="!collapsed"><span class="highlight">ETL</span> 数据平台</h2>
    <a-menu
      :defaultSelectedKeys="defaultSelectedKeys"
      :defaultOpenKeys="['sub1','sub2', 'sub3','sub4']"
      @select="saveSelectedKey"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed">
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="fund" /><span>监控告警</span></span>
        <a-menu-item key="1">监控面板</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="interaction" /><span>数据处理</span></span>
        <a-menu-item key="2">
          <router-link to="/process-manage">流程管理</router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/deployment-manage">部署管理</router-link>
        </a-menu-item>
        <a-menu-item key="4">任务报告</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title"><a-icon type="cluster" /><span>参数配置</span></span>
        <a-menu-item key="5">
          <router-link to="/config-manage">配置管理</router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"><a-icon type="alert" /><span>权限管理</span></span>
        <a-menu-item key="6">
          <router-link to="/permission-approval">权限审批</router-link>
        </a-menu-item>
        <a-menu-item key="7">
          权限查看
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  props: ['collapsed'],
  data () {
    return {
      defaultSelectedKeys: ['1']
    }
  },
  created () {
    let key = JSON.parse(localStorage.getItem('defaultSelectedKeys')) || ['1']
    this.defaultSelectedKeys = key
  },
  methods: {
    // 存储所选的key
    saveSelectedKey ({ item, key, selectedKeys }) {
      localStorage.setItem('defaultSelectedKeys', JSON.stringify([key]))
    }
  }
}
</script>

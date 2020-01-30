<template>
  <a-layout-sider :trigger="null" collapsible v-model="collapsed">
    <div class="logo" />
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['sub1']"
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed">
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="fund" /><span>监控告警</span></span>
        <a-menu-item key="1">Kafka监测</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"><a-icon type="interation" /><span>数据处理</span></span>
        <a-menu-item key="2">流程管理</a-menu-item>
        <a-menu-item key="3">部署管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title"><a-icon type="database" /><span>数据储存</span></span>
        <a-menu-item key="4">数据结构</a-menu-item>
        <a-menu-item key="5">Kafka管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title"><a-icon type="cluster" /><span>参数配置</span></span>
        <a-menu-item key="6">待定</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  props: ['collapsed']
}
</script>

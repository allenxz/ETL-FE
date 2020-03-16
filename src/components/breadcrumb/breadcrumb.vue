<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-if="categoryName !== ''">
      <router-link to="/">首页</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item>{{categoryName}}</a-breadcrumb-item>
    <a-breadcrumb-item
      v-for="(item, index) of breadList"
      :key="index">
      <router-link :to="item.path">{{item.meta.title}}</router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  data () {
    return {
      breadList: [],
      categoryName: ''
    }
  },
  watch: {
    $route (al) {
      this.getBreadcrumb()
    }
  },
  mounted () {
    this.getBreadcrumb()
  },
  methods: {
    isHome (route) {
      return route.name === 'home'
    },
    getBreadcrumb () {
      let matched = this.$route.matched
      // 如果不是首页
      if (!this.isHome(matched[0])) {
        matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
      }
      matched.shift()
      this.breadList = matched
      this.setCategoryName()
    },
    setCategoryName () {
      let name = this.$route.path.split('-').reverse()[1]
      if (name === '/process') {
        this.categoryName = '数据处理'
      } else {
        this.categoryName = ''
      }
    }
  }
}

</script>

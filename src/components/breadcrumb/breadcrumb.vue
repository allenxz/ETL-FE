<template>
  <div>
    <a-breadcrumb v-if="!isSubPage">
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
    <div v-else class="page-header">
      <a-icon type="arrow-left" @click="goBack"/>
      <span>{{title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadList: [],
      categoryName: '',
      isSubPage: false,
      title: ''
    }
  },
  watch: {
    $route () {
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
      if (matched[matched.length - 1].meta.isSubPage === true) {
        this.isSubPage = true
        this.title = matched[matched.length - 1].meta.title
        return
      }
      this.isSubPage = false
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
    },
    goBack () {
      history.go(-1)
    }
  }
}

</script>

<template>
  <div class="breadcrumb">
    <!-- 不是二级页显示面包屑 -->
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
    <!-- 二级页显示返回按钮 -->
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
    // 判断当前是否在首页
    isHome (route) {
      return route.name === 'home'
    },
    // 生成面包屑
    getBreadcrumb () {
      let matched = this.$route.matched
      if (matched[matched.length - 1].meta.isSubPage === true) {
        this.isSubPage = true
        // 看路由有没有传参
        let id = this.$route.params.id
        if (!id) {
          this.title = matched[matched.length - 1].meta.addTitle
        } else {
          this.title = matched[matched.length - 1].meta.editTitle
        }
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
    // 设置二级分类名称
    setCategoryName () {
      let name = this.$route.path.split('-').reverse()[1]
      if (name === '/process') {
        this.categoryName = '数据处理'
      } else {
        this.categoryName = ''
      }
    },
    // 浏览历史回退
    goBack () {
      history.go(-1)
    }
  }
}

</script>

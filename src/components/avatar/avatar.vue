<template>
  <div class="avatar">
    <a-avatar :size="40" icon="user" />
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '用户名',
      isLogin: false
    }
  }
}
</script>

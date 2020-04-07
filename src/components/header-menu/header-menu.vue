<template>
  <ul class="header-menu">
    <li class="icon">
      <a-tooltip>
        <template slot="title">
          关于我们
        </template>
        <a-icon type="question-circle" />
      </a-tooltip>
    </li>
    <li class="icon">
      <a-icon type="bell" />
    </li>
    <li>
      <avatar></avatar>
    </li>
  </ul>
</template>

<script>
import Avatar from '@/components/avatar'
export default {
  components: {
    Avatar
  }
}

</script>

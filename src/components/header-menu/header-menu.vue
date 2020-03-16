<template>
  <ul class="header-menu">
    <li class="icon">
      <a-tooltip>
        <template slot="title">
          使用文档
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
    <li class="icon">
      <a-icon type="global" />
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

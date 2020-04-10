<template>
  <ul class="header-menu">
    <!-- <li>
      <a-tooltip>
        <template slot="title">
          关于我们
        </template>
        <a-icon class="icon" type="question-circle" />
      </a-tooltip>
    </li> -->
    <li >
      <bell></bell>
    </li>
    <li>
      <avatar></avatar>
    </li>
  </ul>
</template>

<script>
import Avatar from '@/components/avatar'
import Bell from '@/components/bell'
export default {
  components: {
    Avatar,
    Bell
  }
}

</script>

<template>
  <ul class="header-menu">
    <li class="icon">
      <a-icon type="question-circle" />
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

<template>
  <div class="card interest-list">
    <ul class="list-group list-group-flush">
      <li
      :key="index"
      v-for="(interest, index) in interests"
      class="list-group-item"
      >{{index}}, {{interest.name}}
    </li>
  </ul>
</div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'InterestList',
  props: {
    interests: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.interest-list {
  overflow-y: scroll;
  height: 95vh;
  li{
    &:hover{
      background-color: darkgrey;
    }
  }
}
</style>

<template>

  <div>
    <a href="add"><button type="button" class="btn btn-outline-success col-12"><i class="fas fa-plus-circle"></i> Ajouter un point d'intérêt</button></a>
    <div class="card interest-list">
      <ul class="list-group list-group-flush">
        <li
        @mouseover="mouseOver(index)"
        @mouseleave="mouseLeave(index)"
        @click="click(index)"
        :key="index"
        v-for="(interest, index) in interests"
        class="list-group-item">{{index}}, {{interest.name}}
      </li>
    </ul>
  </div>
</div>

</template>

<script>

export default {
  name: 'InterestList',
  props: {
    interests: Array
  },
  methods: {
    mouseOver: function(index) {
      this.$root.$emit('mouse-over-interest', index)
    },
    mouseLeave: function(index) {
      this.$root.$emit('mouse-leave-interest', index)
    },
    click: function(index) {
      this.$root.$emit('click-interest', index)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.interest-list {
  overflow-y: scroll;
  height: 95vh;
  li {
    &:hover {
      background-color: darkgrey;
    }
  }
}

</style>

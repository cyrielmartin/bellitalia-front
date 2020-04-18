<template>

  <div>
    <a href="add"><b-button type="button" variant="outline-secondary" class="col-12"><i class="fas fa-plus-circle"></i> Ajouter un point d'intérêt</b-button></a>
    <div class="card interest-list">
      <ul class="list-group list-group-flush">
        <li
        v-for="(interest, index) in interests"
        @mouseover="mouseOver(index)"
        @mouseleave="mouseLeave(index)"
        @click="click(index)"
        @dblclick="dblclick(index)"
        class="list-group-item">
        <div class="container-fluid">
          <div class="row">
            <div class="col-6">
              <span>{{interest.name}}</span>
              <br><div class="badge badge-dark popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span v-bind:key="interestRegion" v-for="(region, interestRegion) in interest.city">{{region.name}}</span></div><br><div><span class="badge badge-warning mr-1 popupText" v-bind:key="interestTag" v-for="(tag, interestTag) in interest.tags">{{tag.name}}</span></div>
            </div>
            <div class="col-6">
              <img :src="interest.image" width="150" class="popupImage"/>
            </div>
          </div>
        </div>

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
    // Au survol de l'intérêt, l'icône grossit
    mouseOver: function(index) {
      this.$root.$emit('mouse-over-interest', index)
    },
    mouseLeave: function(index) {
      this.$root.$emit('mouse-leave-interest', index)
    },
    // Au simple click, le point d'intérêt est centré et on zoome légèrement
    click: function(index) {
      this.$root.$emit('click-interest', index)
    },
    // Au double click, on ouvre le popup lié au point d'intérêt
    dblclick: function(index) {
      this.$root.$emit('dblclick-interest', index)
    },
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

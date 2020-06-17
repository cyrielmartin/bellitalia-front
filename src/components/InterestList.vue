<template>

  <div>
    <div class="card interest-list">
      <ul class="list-group list-group-flush">
        <li
        v-for="(interest, index) in interests"
        @mouseover="mouseOver(index)"
        @mouseleave="mouseLeave(index)"
        @click="click(index)"
        @dblclick="dblclick(index)"
        class="list-group-item">
        <div class="container-fluid ">
          <div class="row listElement">
            <!-- Lieu du point d'intérêt -->
            <div class="container-fluid">
              <div class="badge badge-light interestLocation mb-2"><span><i class="fas fa-location-arrow"></i> {{interest.address}}</span></div>
            </div>
            <div class="col-7 mt-3">
              <!-- Nom -->
              <span>{{interest.name}}</span>
              <!-- Catégorie(s) -->
              <div><span class="badge badge-warning mt-1 mr-1 mb-2" v-bind:key="interestTag" v-for="(tag, interestTag) in interest.tags">{{tag.name}}</span></div>
              <!-- Publication -->
              <!-- WIP : conditionner l'affichage selon si publication/supplement -->
              <!-- <div class="badge badge-secondary mb-2"><i class="far fa-calendar"></i> Bell'Italia n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MMMM YYYY")}}</div> -->
            </div>
            <div v-if="interest.images.length" class="col-5 interestItem">
              <!-- Image(s) -->
              <!-- S'il y a plusieurs images, je ne prends que les 4 premières -->
              <div v-for="(image,imageIndex) in interest.images.slice(0,4)">
                <img :src="image.url" :class="`listImage${imageIndex}`"/>
              </div>
              <!-- <img :src="interest.image" width="150" class="popupImage"/> -->
            </div>
            <div v-else class="col-5">

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
  data: function() {
    return {
      // listImage: 'listImage0',
    }
  },
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
  overflow-x: hidden;
  height: 100vh;
  li {
    &:hover {
      background-color: lightgrey;
      cursor: pointer;
    }
  }
}
.interestLocation {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: max-content;
  // margin-bottom: 3px;
}
.listElement{
  // max-height: 212px;
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 5px;
  margin-left: -40px;
}
.interestItem{
  min-height: 212px;
}
.listImage0 {
  border: 6px solid #fff;
  float: left;
  max-height: 212px;
  max-width: 150px;
  z-index: 4;
  position: relative;
  margin-left: -10px;
  -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}
.listImage1 {
  border: 6px solid #fff;
  float: left;
  max-height: 212px;
  max-width: 150px;
  position: absolute;
  z-index: 3;
  top: 0px;
  left: 0px;
  -webkit-transform: rotate(-5deg);
  -moz-transform: rotate(-5deg);
  -o-transform: rotate(-5deg);
  -ms-transform: rotate(-5deg);
  transform: rotate(-5deg);
  -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}
.listImage2 {
  border: 6px solid #fff;
  float: left;
  max-height: 212px;
  max-width: 150px;
  position: absolute;
  z-index: 2;
  top: 0px;
  left: -5px;
  -webkit-transform: rotate(-10deg);
  -moz-transform: rotate(-10deg);
  -o-transform: rotate(-10deg);
  -ms-transform: rotate(-10deg);
  transform: rotate(-10deg);
  -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}
.listImage3 {
  border: 6px solid #fff;
  float: left;
  max-height: 212px;
  max-width: 150px;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: -10px;
  -webkit-transform: rotate(-15deg);
  -moz-transform: rotate(-15deg);
  -o-transform: rotate(-15deg);
  -ms-transform: rotate(-15deg);
  transform: rotate(-15deg);
  -webkit-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  -moz-box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
}

</style>

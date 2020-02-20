<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container-fluid">
    <div class="row">

      <!-- Colonne de gauche : tableau -->
      <div class="col-4">
        <InterestList :interests="interests" />
      </div>

      <!-- Colonne de droite : carte -->
      <div class="col-8 interest-map">
        <InterestMap :interests="interests"/>
      </div>
    </div>

  </div>

</template>

<script>

import axios from 'axios'
import InterestList from './InterestList.vue'
import InterestMap from './InterestMap.vue'


export default {
  name: 'Bellitalia',
  components: { InterestList, InterestMap },
  data: function() {
    return {
      // Tableau vide qui contiendra tous les points d'intérêt
      interests: [],
      normalIcon: [30, 30],
    }
  },
  // Quand le composant est opérationnel
  mounted: function() {
    axios
    .get('http://127.0.0.1:8000/api/interest')
    .then(r => {this.interests = r.data.data
      // map() permet de greffer une information à la data récupérée par Axios
      .map(r => {
        r.iconSize = this.normalIcon
        return r
      })
    })
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

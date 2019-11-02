<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container">

    <div class="row">

      <!-- Colonne de gauche : tableau -->
      <div class="col-4">
        <!-- Ces événements @mouse... sont récupérés depuis le child component InterestList, où ils sont émis -->
        <InterestList @mouse-over-interest="mouseOverInterest"
        @mouse-leave-interest="mouseLeaveInterest"
        :interests="interests" />
      </div>

      <!-- Colonne de droite : carte -->
      <div class="col-8 interest-map">
        <InterestMap :interests="interests" />
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
      // 2 tailles d'icônes pour les markers
      normalIcon: [20, 20],
      largeIcon: [50, 50]
    }
  },
  // Quand le composant est opérationnel
  mounted: function() {
    // Appel Axios (bien faire le import plus haut)
    axios
    // promesse
    .get('http://127.0.0.1:8000/api/interest')
    // concrétisation de la promesse
    .then(r => {
      // r (pour record) représente la donnée que l'on veut envoyer
      // this est l'instance de Vue
      // les données sont dans r.data :
      this.interests = r.data
      // On peut filtrer les données reçues en utilisant .filter() :
      // this.interests = r.data.filter(r => r.name == 'Santuario di Oropa');
      // map() permet de greffer une information à la data récupérée par Axios
      .map(r => {
        r.iconSize = this.normalIcon
        return r
      })
    })
  },
  methods: {
    mouseOverInterest: function(index) {
      this.interests[index].iconSize = this.largeIcon
    },
    mouseLeaveInterest: function(index) {
      this.interests[index].iconSize = this.normalIcon
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

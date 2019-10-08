<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container">

    <!-- Ligne 1 : titre -->
    <div class="row">
      <div class="col-12">
        <h1 class="text-center text-info">Bell'Italia via Vue.js</h1>
      </div>
    </div>

    <!-- Ligne 2 : contenu -->
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
        interests: []
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
          // r représente la donnée que l'on veut envoyer
          // les données sont dans r.data :
          this.interests = r.data
          // On peut filtrer les données reçues en utilisant .filter() :
          // this.interests = r.data.filter(r => r.name == 'Santuario di Oropa');
        })
    },
    methods: {
      mouseOverInterest: function(index) {
        console.log(index + 'mouse over')
      },
      mouseLeaveInterest: function(index) {
        console.log(index + 'mouse leave')
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

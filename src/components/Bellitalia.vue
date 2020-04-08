<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Input filtre recherche -->
        <input type="text" v-model="search" placeholder="Recherchez un point d'intérêt (nom, ville, région, catégorie...)" class="searchInterest">
      </div>
    </div>

    <div class="row">

      <!-- Colonne de gauche : tableau -->
      <div class="col-4">
        <InterestList :interests="filteredInterests" />
      </div>

      <!-- Colonne de droite : carte -->
      <div class="col-8 interest-map">
        <InterestMap :interests="filteredInterests"/>
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
      search:"",
      tags:[],
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
  // Méthode permettant de filtrer les points d'intérêts "en amont", avant leur envoi à la carte et à la liste, via le search
  // J'utilise toLowerCase pour rendre la recherche insensible à la casse
  // trim() pour ne pas tenir compte des espaces en début et fin de saisie
  computed: {
    filteredInterests: function(){

      return this.interests.filter((interest) => {

        // Pour accéder aux tags, je suis obligé de boucler
        interest.tags.forEach((tag) => {
          this.tags = tag.name;

        });
        return interest.city.name.toLowerCase().trim().match(this.search.toLowerCase().trim()) || interest.name.toLowerCase().trim().match(this.search.toLowerCase().trim()) || interest.city.region_id.name.toLowerCase().trim().match(this.search.toLowerCase().trim()) || this.tags.toLowerCase().trim().match(this.search.toLowerCase().trim());
      });
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.searchInterest {
  margin: auto;
  display: block;
  margin-bottom: 1em;
  width:50%;
}
</style>

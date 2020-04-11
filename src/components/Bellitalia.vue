<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12 inputFilter">
        <!-- Input filtres recherche -->
        <div class="searchInterest">
          <input type="text" v-model="firstSearch" placeholder="Premier input" class="">
          <i @click="input2visible=!input2visible" v-if="!input2visible" class="fas fa-plus addInput" data-toggle="tooltip" data-placement="top" title="Affinez votre recherche"></i>
        </div>

        <!--   <i @click="input2visible=!input2visible" v-if="input2visible" class="far fa-minus-square"></i> -->
        <input type="text" v-if="input2visible" v-model="secondSearch" placeholder="Deuxième input" class="searchInterest">
        <input type="text" v-if="input3visible" v-model="thirdSearch" placeholder="Troisième input" class="searchInterest">
        <input type="text" v-if="input4visible" v-model="lastSearch" placeholder="Dernier input" class="searchInterest">
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
      firstfilter: this.interests,
      normalIcon: [30, 30],
      firstSearch:"",
      secondSearch:"",
      thirdSearch:"",
      lastSearch:"",
      tags:[],
      input2visible: false,
      input3visible: false,
      input4visible: false,
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
  computed: {
    // Pour avoir plusieurs filtres permettant d'affiner la recherche, j'enchaîne les computed.
    // Le premier récupère la liste complète d'interests.
    // Chacun filtre le précédent
    // Le dernier envoie la sélection aux autres composants.
    // Et donc les interests se mettent dynamiquement à jour sur la liste et sur la carte
    firstFilteredInterests:function() {
      var matcher = new RegExp(this.firstSearch.trim(), 'i')
      return this.interests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    secondFilteredInterests:function() {
      var matcher = new RegExp(this.secondSearch.trim(), 'i')
      return this.firstFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    thirdFilteredInterests:function() {
      var matcher = new RegExp(this.thirdSearch.trim(), 'i')
      return this.secondFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    filteredInterests:function() {
      var matcher = new RegExp(this.lastSearch.trim(), 'i')
      return this.thirdFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.searchInterest {
  margin: auto;
  display: block;
  margin-bottom: 1em;
  // width:50%;
}
.inputFilter {
  display: flex;
}

.addInput {
  cursor: pointer;
  font-size: 1.2em;
}
</style>

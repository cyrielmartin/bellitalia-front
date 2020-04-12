<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container-fluid">
    <div class="row">
      <div class="col-12 inputFilter">
        <!-- Input filtres recherche -->
        <div class="searchInterest">
          <input type="text" v-model="search" placeholder="Filtrer par mot clé">
        </div>
        <!-- Dropdown fltre catégories -->
      </div>
    </div>
    <div class="row">
      <div class="col-12 selectFilter">
        <div class="dropdowns">

          <!-- Select filtres catégories -->
          <b-dropdown class="mb-1 mr-1 dropdown-tags" text="Filtrer par catégorie" size="sm">
            <b-dropdown-form>
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allCategories">Toutes/Aucune</b-button>
              <div v-bind:key="storedCategory.id" v-for="storedCategory in storedCategories">
                <b-form-checkbox class="mb-1" size="sm" :value="storedCategory.name" v-model="checkedCategories">{{storedCategory.name}}</b-form-checkbox>
              </div>
            </b-dropdown-form>
          </b-dropdown>

          <!-- Select filtres régions -->
          <b-dropdown id="dropdown-dropright" dropright class="mb-1 dropdown-regions" text="Filtrer par région" size="sm">
            <b-dropdown-form>
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allRegions">Toutes/Aucune</b-button>
              <div v-bind:key="storedRegion.id" v-for="storedRegion in storedRegions">
                <b-form-checkbox class="mb-1" size="sm" :value="storedRegion.name" v-model="checkedRegions">{{storedRegion.name}}</b-form-checkbox>
              </div>
            </b-dropdown-form>
          </b-dropdown>

        </div>
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
      interests: [],
      normalIcon: [30, 30],
      storedRegions: [],
      storedCategories: [],
      checkedRegions: [],
      checkedCategories: [],
      search:"",
      tags:[],
    }
  },
  methods: {
    // Récupération des régions en BDD
    getRegions() {
      axios.get('http://127.0.0.1:8000/api/region')
      .then(response => (
        this.storedRegions = response.data,
        this.storedRegions.forEach((storedRegion) => {
          this.checkedRegions.push(storedRegion.name)
        })
      ))
    },
    // Récupération des catégories en BDD
    getCategories() {
      axios.get('http://127.0.0.1:8000/api/tag')
      .then(response => (
        this.storedCategories = response.data,
        this.storedCategories.forEach((storedCategory) => {
          this.checkedCategories.push(storedCategory.name)
        })
      ))
    },
    allRegions: function(){
      if(this.checkedRegions.length==0) {
        this.storedRegions.forEach((storedRegion, index) => {
          this.checkedRegions.push(storedRegion.name)
        })
      } else {
        this.checkedRegions = []
      }
    },
    // Cocher toutes les catégories dans le filtre
    allCategories: function(){
      if(this.checkedCategories.length==0) {
        this.storedCategories.forEach((storedCategory) => {
          this.checkedCategories.push(storedCategory.name)
        })
      } else {
        this.checkedCategories = []
      }
    },
  },
  computed: {
    // Pour avoir plusieurs filtres permettant d'affiner la recherche, j'enchaîne les computed.
    // Le premier (select) récupère la liste complète d'interests et filtre les régions.
    // Le deuxième (select) récupère le premier et filtre les catégories.
    // Le troisième (input) récupère le deuxième et permet de filtrer "manuellement" sur le reste de la sélection
    // La sélection ainsi faite est envoyée aux autres composants.
    // Et donc les interests se mettent dynamiquement à jour sur la liste et sur la carte
    regionsFilteredInterests:function() {
      return this.interests.filter((interest) => {
        return this.checkedRegions.includes(interest.city.region_id.name);
      });
    },
    categoriesFilteredInterests:function(){
      return this.regionsFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return this.checkedCategories.includes(tag.name);
        });
      });
    },
    filteredInterests:function() {
      var matcher = new RegExp(this.search.trim(), 'i')
      return this.categoriesFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
  },
  created: function(){
    this.getRegions();
    this.getCategories();
  },
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

<style lang="scss" scoped>
.searchInterest {
  margin: auto;
  display: block;
  margin-bottom: 0.5em;
}
.dropdowns {
  margin: auto;
  display: block;
  margin-bottom: 0.5em;
}
.inputFilter {
  display: flex;
}
.selectFilter{
  display: flex;
}
.addInput {
  cursor: pointer;
  font-size: 1.2em;
}

.b-dropdown-form {
  padding: 4px;
  outline: 0;
  margin-left: 1px;
}

.filter-button {
  margin-bottom: 10%;
}

// .drop{
//   display: flex;
//   justify-content: right;
// }

.btn-group, .btn-group-vertical {
  position: relative;
  display: -ms-inline-flexbox;
  display: -webkit-inline-box;
  // display: inline-flex;
  vertical-align: middle;
}
</style>

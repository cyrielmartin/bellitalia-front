<!-- Ce composant est le composant principal du site. Il est importé depuis App.vue -->
<template>

  <div class="container-fluid">

    <div class="row">
      <div class="col-12 selectFilter">
        <div class="dropdowns">

          <!-- Select filtres publications -->
          <b-dropdown no-flip class="mb-1 mr-1" :variant=publicationClass :text=publicationSelectText size="sm">

            <b-dropdown-form id="publicationDropdown">
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allPublications">Tous/Aucun</b-button>
              <div v-bind:key="storedPublication.id" v-for="storedPublication in storedPublications">
                <b-form-checkbox class="mb-1" size="sm" :value="storedPublication.number" v-model="checkedPublications">n°{{storedPublication.number}}<br>{{storedPublication.publication | moment("MMM YYYY")}}</b-form-checkbox>
              </div>
              <a href="#" class="editTags"><i class="far fa-edit"></i> Modifier les numéros</a>
            </b-dropdown-form>
          </b-dropdown>

          <!-- Select filtres catégories -->
          <b-dropdown class="mb-1 mr-1" :variant=categoryClass :text=categorySelectText size="sm">

            <b-dropdown-form>
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allCategories">Toutes/Aucune</b-button>
              <div v-bind:key="storedCategory.id" v-for="storedCategory in storedCategories">
                <b-form-checkbox class="mb-1" size="sm" :value="storedCategory.name" v-model="checkedCategories">{{storedCategory.name}}</b-form-checkbox>
              </div>
              <a href="#" class="editTags"><i class="far fa-edit"></i> Modifier les catégories</a>
            </b-dropdown-form>
          </b-dropdown>

          <!-- Select filtres régions -->
          <b-dropdown no-flip class="mb-1 mr-1" :variant=regionClass :text=regionSelectText size="sm">
            <b-dropdown-form>
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allRegions">Toutes/Aucune</b-button>
              <div v-bind:key="storedRegion.id" v-for="storedRegion in storedRegions">
                <b-form-checkbox class="mb-1" size="sm" :value="storedRegion.name" v-model="checkedRegions">{{storedRegion.name}}</b-form-checkbox>
              </div>
            </b-dropdown-form>
          </b-dropdown>

          <!-- Select par mot-clé -->
          <b-dropdown :variant=keywordClass :text=keywordSelectText ref="dropdown" class="mb-1 mr-1" size="sm">
            <b-dropdown-form>
              <b-form-group >
                <b-form-input
                class="formInput"
                size="sm"
                placeholder="mot-clé 1"
                v-model="search1"
                @keydown.enter.prevent
                ></b-form-input>
                <b-form-input
                class="formInput"
                size="sm"
                placeholder="mot-clé 2"
                v-model="search2"
                @keydown.enter.prevent
                ></b-form-input>
                <b-form-input
                class="formInput"
                size="sm"
                placeholder="mot-clé 3"
                v-model="search3"
                @keydown.enter.prevent
                ></b-form-input>
                <b-form-input
                class="formInput"
                size="sm"
                placeholder="mot-clé 4"
                v-model="search4"
                @keydown.enter.prevent
                ></b-form-input>
                <b-form-input
                class="formInput"
                size="sm"
                placeholder="mot-clé 5"
                v-model="search5"
                @keydown.enter.prevent
                ></b-form-input>
                <b-button pill variant="outline-secondary" class="filter-button mt-2" size="sm" @click="emptySearchInput">Réinitialiser</b-button>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>

          <!-- Réinitialisation de tous les filtres de recherche -->
          <b-button @click="resetFilters" v-b-tooltip.hover.right="'Réinitialiser tous les filtres'" size="sm" class="mb-1"><i class="fas fa-undo-alt"></i></b-button>

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
      storedPublications: [],
      checkedRegions: [],
      checkedCategories: [],
      checkedPublications: [],
      search1:"",
      search2:"",
      search3:"",
      search4:"",
      search5:"",
      tags:[],
    }
  },
  methods: {
    // Rénitialisation de tous les filtres de recherche
    resetFilters() {
      // Je décoche toutes les régions
      this.checkedRegions = [];
      // Et je recoche tout
      this.storedRegions.forEach((storedRegion, index) => {
        this.checkedRegions.push(storedRegion.name)
      });
      // Je décoche toutes les catégories
      this.checkedCategories = [];
      // Et je recoche tout
      this.storedCategories.forEach((storedCategory) => {
        this.checkedCategories.push(storedCategory.name)
      })
      // Je décoche tous les numéros
      this.checkedPublications = [];
      // Et je recoche tout
      this.storedPublications.forEach((storedPublication) => {
        this.checkedPublications.push(storedPublication.number)
      })
      // Et je vide tous les input du select de recherche
      this.emptySearchInput();
    },
    emptySearchInput() {
      this.search1 = "";
      this.search2 = "";
      this.search3 = "";
      this.search4 = "";
      this.search5 = "";
    },
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
    // Récupération des numéros BI en BDD
    getPublications() {
      axios.get('http://127.0.0.1:8000/api/bellitalia')
      .then(response => (
        this.storedPublications = response.data,
        this.storedPublications.forEach((storedPublication) => {
          this.checkedPublications.push(storedPublication.number)
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
    // Cocher tous les numéros dans le filtre
    allPublications: function(){
      if(this.checkedPublications.length==0) {
        this.storedPublications.forEach((storedPublication) => {
          this.checkedPublications.push(storedPublication.number)
        })
      } else {
        this.checkedPublications = []
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
    publicationsFilteredInterests:function() {
      return this.categoriesFilteredInterests.filter((interest) => {
        return this.checkedPublications.includes(interest.bellitalia.number);
      });
    },
    firstSearchInterests:function() {
      var matcher = new RegExp(this.search1.trim(), 'i')
      return this.publicationsFilteredInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    secondSearchInterests:function() {
      var matcher = new RegExp(this.search2.trim(), 'i')
      return this.firstSearchInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    thirdSearchInterests:function() {
      var matcher = new RegExp(this.search3.trim(), 'i')
      return this.secondSearchInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    fourthSearchInterests:function() {
      var matcher = new RegExp(this.search4.trim(), 'i')
      return this.thirdSearchInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    filteredInterests:function() {
      var matcher = new RegExp(this.search5.trim(), 'i')
      return this.fourthSearchInterests.filter((interest) => {
        return  interest.tags.some((tag) => {
          return matcher.test([interest.city.name,interest.name,interest.city.region_id.name,tag.name].join())
        });
      });
    },
    //Affichage dynamique des sélect en fonction du nombre qui a été sélectionné
    categorySelectText:function(){
      if(this.checkedCategories.length === this.storedCategories.length) {
        return "Filtrer par catégorie";
      } else if (this.checkedCategories.length === 0) {
        return "Aucune catégorie sélectionnée";
      }
      else if(this.checkedCategories.length === 1) {
        return "1 catégorie sélectionnée";
      } else {
        return this.checkedCategories.length+" catégories sélectionnées";
      }
    },
    regionSelectText:function(){
      if(this.checkedRegions.length === this.storedRegions.length) {
        return "Filtrer par région";
      } else if (this.checkedRegions.length === 0) {
        return "Aucune région sélectionnée";
      }
      else if(this.checkedRegions.length === 1) {
        return "1 région sélectionnée";
      } else {
        return this.checkedRegions.length+" régions sélectionnées";
      }
    },
    keywordSelectText:function(){
      if(this.search1 || this.search2 || this.search3 || this.search4 || this.search5) {
        return "Au moins 1 mot-clé saisi";
      } else {
        return "Filtrer par mot-clé";
      }

    },
    publicationSelectText:function(){
      if(this.checkedPublications.length === this.storedPublications.length) {
        return "Filtrer par numéro";
      } else if (this.checkedPublications.length === 0) {
        return "Aucun numéro sélectionné";
      }
      else if(this.checkedPublications.length === 1) {
        return "1 numéro sélectionné";
      } else {
        return this.checkedPublications.length+" numéros sélectionnés";
      }
    },
    // Changement d'apparence des select si tout n'est pas coché
    categoryClass:function(){
      if(this.checkedCategories.length === this.storedCategories.length) {
        return "";
      } else {
        return "danger";
      }
    },
    regionClass:function(){
      if(this.checkedRegions.length === this.storedRegions.length) {
        return "";
      } else {
        return "danger";
      }
    },
    keywordClass:function(){
      if(this.search1 || this.search2 || this.search3 || this.search4 || this.search5) {
        return "danger";
      } else {
        return "";
      }
    },
    publicationClass:function(){
      if(this.checkedPublications.length === this.storedPublications.length) {
        return "";
      } else {
        return "danger";
      }
    },
  },
  created: function(){
    this.getRegions();
    this.getCategories();
    this.getPublications();
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
.editTags {
  font-size: 0.8em;
}
.searchInterest {
  margin: auto;
  display: block;
  margin-bottom: 0.5em;
  width:50%;
  // border-top: none;
  // border-left: none;
  // border-right: none;
}
.dropdowns {
  margin: auto;
  display: block;
  margin-bottom: 0.5em;
  z-index: 2000;
}
.selectFilter{
  display: flex;
  margin: inherit;
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

#publicationDropdown {
  columns:6;
}

.filter-button {
  margin-bottom: 10%;
}

.btn-group, .btn-group-vertical {
  position: relative;
  display: -ms-inline-flexbox;
  display: -webkit-inline-box;
  // display: inline-flex;
  vertical-align: middle;
}

.formInput {
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}
</style>

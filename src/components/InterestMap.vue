<template>
  <div class="">
    Width: {{ window.width }},
    Height: {{ window.height }}
    Zoom : {{zoom}}
    Center : {{center}}
    <div class="row map">
      <div class="container-fluid drop">

        <!-- Dropdown fltre catégories -->
        <b-dropdown class="mb-1 mr-1 dropdown-regions" text="Filtrer par catégorie" size="sm">
          <b-dropdown-form>
            <b-dropdown-form>
              <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allCategories">Toutes/Aucune</b-button>
              <div class="" v-bind:key="storedCategory" v-for="(storedCategory) in storedCategories">
                <b-form-checkbox class="mb-1" size="sm" :value="storedCategory.name" v-model="checkedCategories">{{storedCategory.name}}</b-form-checkbox>
              </div>
            </b-dropdown-form>
          </b-dropdown-form>
        </b-dropdown>

        <!-- Dropdown filtres régions -->
        <b-dropdown class="mb-1 dropdown-tags" text="Filtrer par région" size="sm">
          <b-dropdown-form>
            <b-button pill variant="outline-secondary" class="filter-button" size="sm" @click="allRegions">Toutes/Aucune</b-button>
            <div class="" v-bind:key="storedRegion" v-for="(storedRegion) in storedRegions">
              <b-form-checkbox class="mb-1" size="sm" :value="storedRegion.name" v-model="checkedRegions">{{storedRegion.name}}</b-form-checkbox>
            </div>
          </b-dropdown-form>
        </b-dropdown>
      </div>

      <!-- Carte -->
      <l-map
      ref="myMap"
      @update:center="centerUpdate"
      :options="{ scrollWheelZoom: false, gestureHandling: true}"
      :zoom="zoom"
      :max-zoom="maxZoom"
      :center="center">
      <!-- Surcouche OSM -->
      <l-tile-layer :url="url" :attribution="attribution">
      </l-tile-layer>

      <!-- Bouton pour recentrer la carte -->
      <l-control
      :position="'topleft'"
      class="center-button">
      <div @click="recenterMap">
        <i class="far fa-dot-circle"></i>
      </div>
    </l-control>

    <!-- Marqueurs -->
    <div class="" v-bind:key="interest" v-for="(interest,interestIndex) in interests">
      <div class="" v-bind:key="region" v-for="(region, interestRegion) in interest.city">
        <div class="" v-bind:key="interestTag" v-for="(tag, interestTag) in interest.tags">


          <l-marker
          :key="interestIndex"
          @popupclose="popupclose"
          v-if="checkedRegions.includes(region.name) && checkedCategories.includes(tag.name)"
          :lat-lng="latLng(interest.latitude, interest.longitude)">
          <!-- Icône pour marqueurs -->
          <l-icon :icon-size="interest.iconSize" :icon-url="icon">
          </l-icon>

          <!-- Popup -->
          <l-popup :options="{ keepInView: true}"><div><span class="badge badge-warning mr-1 popupText">{{tag.name}}</span></div><h1 class="mt-3 mb-3">{{interest.name}}</h1><img :src="interest.image" width="300" class="popupImage"/><div class="badge badge-info popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span :key="interestRegion">{{region.name}}</span></div><p class="popupText">{{interest.description}}</p><p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link"><i class="fas fa-external-link-alt"></i> Lien</a></p><div class="badge badge-secondary popupText"><i class="far fa-calendar"></i> Bell'Italia n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MM/YYYY")}}</div><br><div class="mt-4"><a :href="/interest/+interest.id"><i class="far fa-edit"></i> Modifier</a><span class="ml-4 deleteLink" @click="deleteButton($event, interest.id)"><i class="far fa-trash-alt deleteLink"></i> Supprimer</span></div></l-popup>
        </l-marker>
      </div>
    </div>
  </div>

</l-map>

<!-- Modal suppression marqueur -->
<modal name="delete">
</modal>
<v-dialog/>
</div>
</div>

</template>

<script>

import { LMap, LTileLayer, LMarker, LIcon, LPopup, LControl } from 'vue2-leaflet'
import L from 'leaflet'
import axios from 'axios'
import { GestureHandling } from "leaflet-gesture-handling"
import "leaflet/dist/leaflet.css"
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css"


import marker from '../assets/marker.png'

export default {
  name: 'InterestMap',
  data: function() {
    return {
      zoom: 0,
      maxZoom: 15,
      center: [],
      currentCenter: [41.89591, 12.508798],
      url: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(41.89591, 12.508798),
      icon: marker,
      iconSize: [30, 30],
      href:'',
      linkUrl: 'https://',
      checkedRegions: [],
      storedRegions: [],
      storedCategories: [],
      checkedCategories: [],
      window: {
        width: 0,
        height: 0
      },
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    LControl,

  },
  methods: {
    // Récupération des régions en BDD et check de toutes les régions sur le filtre
    getRegions() {
      axios.get('http://127.0.0.1:8000/api/region')
      .then(response => (
        this.storedRegions = response.data,
        this.storedRegions.forEach((storedRegion) => {
          this.checkedRegions.push(storedRegion.name)
        })
      ))
    },
    getCategories() {
      axios.get('http://127.0.0.1:8000/api/tag')
      .then(response => (
        this.storedCategories = response.data,
        this.storedCategories.forEach((storedCategory) => {
          this.checkedCategories.push(storedCategory.name)
        })
      ))
    },
    // Cocher toutes les régions dans le filtre
    allRegions: function(){
      if(this.checkedRegions.length==0) {
        this.storedRegions.forEach((storedRegion) => {
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
    // Méthode pour recentrer la carte via bouton dédié
    recenterMap: function(){
      this.$nextTick(() => {
        this.$refs.myMap.mapObject.flyTo([41.89591, 12.508798], this.zoom)
      })
    },
    // A chaque fermeture de popup, on recentre la carte
    popupclose: function(){
      this.$nextTick(() => {
        this.$refs.myMap.mapObject.flyTo([41.89591, 12.508798], 6)
      })
    },
    centerUpdate: function(center) {
      this.currentCenter = center
    },
    deleteButton(event, id){
      this.$modal.show('dialog', {
        title: 'Suppression d\'un point d\'intérêt',
        text: 'Êtes-vous sûr de vouloir supprimer ce point d\'intérêt ?',
        buttons: [
          {
            title: 'Supprimer',
            handler: () => {
              axios.delete('http://127.0.0.1:8000/api/interest/'+id, {
              }).then(() =>
              // On recharge la page pour que le marker et la ligne dans le tableau disparaissent bien
              document.location.reload(true),
              //On referme la modale
              this.$modal.hide('dialog'),
              //On referme la popup
              this.$nextTick(() => {
                this.$refs.myMap.mapObject.closePopup()
              }),
            )
          }
        },
        {
          // Dans le cas où on clique sur Annuler, on vide l'input et on ferme la modale
          // handler:()=> {this.interestNumber.pop(), this.hideModal()},
          title: 'Annuler',
        }
      ]
    })
  },
  latLng: function(lat, lng) {
    return L.latLng(lat, lng)
  },
  handleResize() {
    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
  },
  // Ecran 34 pouces : 3440 x 1440 (21/9)
  // Ecran 30 pouces : 2560 x 1600 (16/10e)
  // Ecran 27 pouces : 2560 x 1440 (16/9e)
  // Ecran 24 pouces : 1920 * 1200 (16/10e)
  // Ecran 21 pouces : 1680 x 1050
  // Ecran 19 pouces : 1366 x 768 (16/9e)
  // Ecran 17 pouces : 1280 x 1024 (4/3)
  // Ecran 15.4 pouces : 1280 x 800 (16/10e)
  // Ecran 15 pouces : 1024 x 768 (4/3)
  // Ecran 13 pouces : 800 * 600 (4/3)

  // Changement de zoom en fonction de la taille de l'écran
  setMapZoom() {
    if(this.window.width <= 1280) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    } else if (this.window.width <=1366) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    } else if (this.window.width <= 1680) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    } else if (this.window.width <= 1920) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    } else if (this.window.width <= 2560) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    } else if (this.window.width <= 3440) {
      this.zoom = 6;
      this.center = [41.89591, 12.508798];
    }
  },
},
created: function(){
  this.getRegions(),
  this.getCategories(),
  window.addEventListener('resize', this.handleResize)
  this.handleResize();
  this.setMapZoom();
},
destroyed() {
  window.removeEventListener('resize', this.handleResize)
},
props: {
  interests: Array,
  text: {
    type: String,
    default: ""
  },
  position: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: ""
  },
}
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.map {
  height: 100vh;
}

.popupText {
  font-size: 0.8rem;
}

.deleteLink {
  color: red;
  cursor: pointer;
}

.hideMarker {
  opacity: 100%;
}

.center-button {
  font-size: 1.6em;
  background-color: white;
  border: 0.1em solid #9ca3ad;
  padding: 0% 10%;
  margin-left: 26%;
  border-radius: 8%;
  cursor: pointer;
}

.center-button:hover{
  background-color: #F4F4F4;
}

.leaflet-control {
  max-height: 90vh;
  overflow: auto;
}

h1,.muted {
  color: #2c3e5099;
}

h1 {
  font-size: 26px;
  font-weight: 600;
}

.b-dropdown-form {
  padding: 4px;
  outline: 0;
  margin-left: 1px;
}

.filter-button {
  margin-bottom: 10%;
}

.drop{
  display: flex;
  justify-content: right;
}

</style>

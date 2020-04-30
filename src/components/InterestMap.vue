<template>
  <div class="">
    <!-- Width: {{ window.width }},
    Height: {{ window.height }}
    Zoom : {{zoom}}
    Center : {{center}} -->
    <div class="row map">
      <div class="container-fluid drop">

      </div>

      <!-- Carte -->
      <l-map
      ref="myMap"
      @update:center="centerUpdate"
      :options="{ scrollWheelZoom: false, gestureHandling: true}"
      :zoom="zoom"
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
      :center="center">
      <!-- Surcouche OSM -->
      <l-tile-layer :url="url" :attribution="attribution">
      </l-tile-layer>

      <!-- Bouton pour recentrer la carte -->
      <l-control
      :position="'topleft'"
      v-b-tooltip.hover.right title="Recentrer la carte"
      class="center-button">
      <div @click="recenterMap">
        <i class="far fa-dot-circle"></i>
      </div>
    </l-control>

    <!-- Clusters -->
    <!-- <v-marker-cluster :options="clusterOptions"> -->

    <!-- Marqueurs -->
    <l-marker
    @popupclose="popupclose"
    ref="myMarker"
    v-bind:key="interestIndex" v-for="(interest,interestIndex) in interests"
    :lat-lng="[interest.latitude, interest.longitude]">

    <!-- Tool tip au passage de la souris sur un marker -->
    <l-tooltip>{{interest.name}}{{interest.id}}</l-tooltip>

    <!-- Icône pour marqueurs -->
    <l-icon :icon-size="interest.iconSize" :icon-url="icon">
    </l-icon>

    <!-- Popup -->
    <l-popup :options="{ keepInView: true, minWidth:180}">

      <!-- Popup : catégories -->
      <div class="popupContent">
        <div>
          <span class="badge badge-warning mr-1 popupText" v-bind:key="interestTag" v-for="(tag, interestTag) in interest.tags">{{tag.name}}</span>
        </div>
        <!-- Popup : nom du point d'intérêt -->
        <h1 class="mt-3 mb-1">{{interest.name}}</h1>
        <!-- Popup : photo du point d'intérêt -->
        <div class="">
          <img :src="interest.image" width="300" class="popupImage"/>
        </div>
        <!-- Popup : lieu du point d'intérêt -->
        <div class="badge badge-light popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span v-bind:key="interestRegion" v-for="(region, interestRegion) in interest.city">{{region.name}}</span></div>
        <!-- Popup : description du point d'intérêt -->
        <p class="popupText">{{interest.description}}</p>
        <!-- Popup : lien -->
        <!-- <p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link"><i class="fas fa-external-link-alt"></i> Lien</a></p> -->
        <!-- Popup : numéro de Bell'Italia concerné (image + infos) -->
        <img :src="interest.bellitalia.image" class="popupImage"/><br>
        <div class="badge badge-secondary popupPublicationText"><i class="far fa-calendar"></i> n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MMMM YYYY")}}</div>
        <!-- Popup : liens modifier et supprimer -->
        <div class="mt-2"><a :href="/interest/+interest.id"><i class="far fa-edit"></i> Modifier</a>
          <span class="ml-4 deleteLink" @click="deleteButton($event, interest.id)"><i class="far fa-trash-alt deleteLink"></i> Supprimer</span>
        </div>
      </div>
    </l-popup>
  </l-marker>

  <!-- </v-marker-cluster> -->

</l-map>

<!-- Modal confirmation suppression point d'intérêt -->
<modal name="delete">
</modal>
<v-dialog/>

</div>
</div>

</template>

<script>

import { LMap, LTileLayer, LMarker, LIcon, LPopup, LControl, LTooltip } from 'vue2-leaflet'
import L from 'leaflet'
import axios from 'axios'
import { GestureHandling } from "leaflet-gesture-handling"
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import "leaflet/dist/leaflet.css"
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

import marker from '../assets/marker.png'

export default {
  name: 'InterestMap',
  data: function() {
    return {
      zoom: 0,
      maxZoom: 15,
      minZoom:2,
      center: [],
      url: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      href:'',
      linkUrl: 'https://',
      icon: marker,
      iconSize: [30, 30],
      markerNormalIcon: [30, 30],
      markerLargeIcon: [45, 45],
      clusterOptions: {disableClusteringAtZoom: 7, showCoverageOnHover: false, spiderfyOnMaxZoom: true, maxClusterRadius:30, iconCreateFunction: function() {
        return L.divIcon({ html: '<div style="font-size: 2.3em; color:#c0392b;"<i class="fas fa-search-plus"></i></div>', className: ""});
      }},
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
    LTooltip,
    'v-marker-cluster': Vue2LeafletMarkerCluster,

  },
  methods: {
    openPublicationImage(){
      console.log('open')
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
mounted: function(){
  // Au passage de la souris, l'icône grossit
  this.$root.$on('mouse-over-interest', (index) => {
    this.interests[index].iconSize = this.markerLargeIcon
  });
  // Quand la souris n'est plus sur le point, l'icône redevient normale.
  this.$root.$on('mouse-leave-interest', (index) => {
    this.interests[index].iconSize = this.markerNormalIcon
  });

  // Au simple click, je zoom légèrement vers le point d'intérêt
  this.$root.$on('click-interest', (index) => {
    // Mais avant, si un popup est déjà ouvert, je le ferme
    this.$refs.myMap.mapObject.closePopup()
    this.$refs.myMap.mapObject.flyTo([this.interests[index].latitude, this.interests[index].longitude], 7)
  });

  // Au double click, j'ouvre le popup
  this.$root.$on('dblclick-interest', (index) => {
    // Avant, si un popup est déjà ouvert, je le ferme
    this.$refs.myMap.mapObject.closePopup()
    this.$refs.myMarker[index].mapObject.openPopup()
  });

},
created: function(){
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

<style lang="scss" scoped>

.map {
  height: 100vh;
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
  font-size: 30px;
  font-weight:600;
}
.popupContent {
  text-align: center;
}
.popupText {
  font-size: 0.8rem;
}
.popupPublicationText {
  font-size: 0.7rem;
}
.popupImage {
  max-width:100px;
  border-radius: 0.25rem;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: .3s ease-in-out;
  transition: .3s ease-in-out;
}
.popupImage:hover {
  -webkit-transform: scale(4.5);
  transform: scale(4.5);
  z-index: 10;
}

</style>

<template>
  <div class="">
    <!-- Width: {{ window.width }},
    Height: {{ window.height }}
    Zoom : {{zoom}}
    Center : {{center}} -->
    <div class="row map">
      <div class="container-fluid drop">
      </div>

      <!-- @update:center="centerUpdate" -->
      <!-- Carte -->
      <l-map
      ref="myMap"
      :options="{ scrollWheelZoom: false, gestureHandling: true}"
      :zoom="zoom"
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
      :center="center">

      <!-- Gestion multi cartes (plan et satellite) -->
      <l-tile-layer
      v-for="tileProvider in tileProviders"
      :key="tileProvider.name"
      :name="tileProvider.name"
      :visible="tileProvider.visible"
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
      layer-type="base"/>

      <!-- Pour tracer une ligne droite entre 2 points -->
      <l-polygon :lat-lngs="polygon.latlngs" :color="polygon.color"></l-polygon>

      <!-- Barre de recherche pour géolocalisation -->
      <v-geosearch :options="geosearchOptions" ></v-geosearch>

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

    <!-- Bouton pour affichage alterné des cartes plan/satellite -->
    <l-control-layers position="topright"  ></l-control-layers>

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
    <l-popup :options="{ keepInView: true, minWidth:300, maxWidth:500, closeOnEscapeKey:false}">

      <!-- Popup : catégories -->
      <div class="popupContent">
        <div>
          <span class="badge badge-warning mr-1 popupText" v-bind:key="interestTag" v-for="(tag, interestTag) in interest.tags">{{tag.name}}</span>
        </div>
        <!-- Popup : nom du point d'intérêt -->
        <h1 class="mt-3 mb-1">{{interest.name}}</h1>
        <!-- Popup : lieu du point d'intérêt -->
        <div class="badge badge-light popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span v-bind:key="interestRegion" v-for="(region, interestRegion) in interest.city">{{region.name}}</span></div>
        <!-- Popup : photos du point d'intérêt -->
        <div class="" v-viewer="viewerInterestOptions">
          <div class="popupImageContainer row">
            <div v-for="image in interest.images" class="col popupImageCol">
              <img :src="image.url" class="popupImages"/>
            </div>
          </div>
        </div>
        <!-- Popup : description du point d'intérêt -->
        <p class="popupText">{{interest.description}}</p>
        <!-- Popup : lien -->
        <!-- <p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link"><i class="fas fa-external-link-alt"></i> Lien</a></p> -->
        <!-- Popup : numéro de Bell'Italia concerné (image + infos) -->
        <div v-viewer="viewerPublicationOptions" class="">
          <img :src="interest.bellitalia.image" class="popupImages"/><br>
        </div>
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

import { LMap, LTileLayer, LControlLayers, LMarker, LIcon, LPopup, LControl, LTooltip, LPolygon } from 'vue2-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import axios from 'axios'
import { GestureHandling } from "leaflet-gesture-handling"
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "viewerjs/dist/viewer.css"
import marker from '../assets/marker.png'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import VGeosearch from 'vue2-leaflet-geosearch'

export default {
  name: 'InterestMap',
  data: function() {
    return {
      // Tous les éléments geosearchOptions = recherche géographique sur la carte
      geosearchOptions: {
        provider: new OpenStreetMapProvider({
          params: {
            countrycodes: ['it', 'sm', 'va']
          }
        }),
        searchLabel: 'Recherchez un lieu',
        autoClose: true,
        keepResult: true,
        showPopup: true,
        style: 'bar',
        // Dans le popup qui s'affiche, on met un lien avec les infos du lieu dans l'url pour pouvoir les récupérer dans le formulaire d'ajout d'un point d'intérêt
        popupFormat: function(query) {
          console.log(query)
          return `<span>${query.result.label} </span><br><a href="add/?nom=${query.result.label}&longitude=${query.result.x}&latitude=${query.result.y}">Créer un point d'intérêt à cet endroit</a>`
        },
      },
      zoom: 0,
      latlng:[],
      maxZoom: 18,
      minZoom:2,
      center: [],
      viewerInterestOptions: {title: false, scalable: false},
      // Gestion multi cartes plan/satellite
      tileProviders: [
        {
          name: 'Plan',
          visible: true,
          attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'Satellite',
          visible: false,
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution:
          '&copy; <a target="_blank" href="https://www.esri.com/arcgis-blog/products/constituent-engagement/constituent-engagement/esri-world-imagery-in-openstreetmap/">Esri</a> contributors',
        },
      ],
      // Pour tracer une ligne droite entre 2 points
      polygon: {
        // latlngs: [[41.9002044, 12.4457442], [41.9073912, 12.4583653]],
        color: 'green'
      },
      href:'',
      linkUrl: 'https://',
      icon: marker,
      iconSize: [30, 30],
      markerNormalIcon: [30, 30],
      markerLargeIcon: [45, 45],
      clusterOptions: {disableClusteringAtZoom: 7, showCoverageOnHover: false, spiderfyOnMaxZoom: true, maxClusterRadius:30, iconCreateFunction: function() {
        return L.divIcon({ html: '<div style="font-size: 2.3em; color:#c0392b;"<i class="fas fa-search-plus"></i></div>', className: ""});
      }},
      viewerPublicationOptions: {title: false, scalable: false, navbar: false},
      window: {
        width: 0,
        height: 0
      },
    }
  },
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LMarker,
    LIcon,
    LPopup,
    LControl,
    LTooltip,
    LPolygon,
    'v-marker-cluster': Vue2LeafletMarkerCluster,
    VGeosearch,

  },
  methods: {
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
  // Récupération de la requête envoyée dans le geosearch
  // this.$refs.myMap.mapObject.on('geosearch/showlocation', function(result){
  //   console.log('result', result)
  // });
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
  window.addEventListener('resize', this.handleResize);
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

<style lang="scss">

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
  overflow: auto;
  max-height: 550px;
  padding: 0 10% 0 10%;
}
.popupText {
  font-size: 0.8rem;
}
.popupPublicationText {
  font-size: 0.7rem;
}
.popupImageContainer {
  display: flex;
  align-items: center;
}
.popupImageCol {
  padding: unset;
}
.popupImages {
  max-width:100px;
  border-radius: 0.25rem;
  margin-bottom: 5px;
}
.popupImages:hover {
  cursor: zoom-in;
}

</style>

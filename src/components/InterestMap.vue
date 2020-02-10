<template>
  <div class="">
    <div class="row map">
      <!-- Affichage de la carte -->
      <l-map
      ref="myMap"
      @update:center="centerUpdate"
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
    <!-- Module filtres régions -->
    <l-control
    :position="'topright'">
    <div class="select-regions">

      <!-- Module de filtres -->
      <p>Filtrer par région :</p>
      <button type="button" name="button" @click="allRegions">Toutes</button>

      <!-- Récupération de toutes les régions -->
      <div class="" v-for="(storedRegion,storedRegionIndex) in storedRegions">
        <!-- Select -->
        <div>
          <input type="checkbox" id="storedRegion.name" :value="storedRegion.name" v-model="checkedRegions">
          <label for="storedRegion.name">{{storedRegion.name}}</label>
        </div>
      </div>
      <!-- Checked
      {{checkedRegions}}
      <div class="">Stored
      {{storedRegions}}
    </div> -->


  </div>

</l-control>
<!-- Marqueurs -->
<!-- On récupère d'abord les régions pour les filtres (marqueur affiché que si région cochée)  -->
<div class="" v-for="(interest,interestIndex) in interests">
  <div class="" v-for="(region, interestRegion) in interest.city">
    <l-marker
    :key="interestIndex"
    @popupclose="popupclose"
    v-if="checkedRegions.includes(region.name)"
    :lat-lng="latLng(interest.latitude, interest.longitude)">
    <!-- Icône pour marqueurs -->
    <l-icon :icon-size="interest.iconSize" :icon-url="icon">
    </l-icon>
    <l-popup :options="{ keepInView: true}"><div><span  :key="interestTag" v-for="(tag, interestTag) in interest.tags" class="badge badge-warning mr-1 popupText">{{tag.name}}</span></div><h1 class="mt-3 mb-3">{{interest.name}}</h1><img :src="interest.image" width="300" class="popupImage"/><div class="badge badge-info popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span :key="interestRegion">{{region.name}}</span></div><p class="popupText">{{interest.description}}</p><p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link"><i class="fas fa-external-link-alt"></i> Lien</a></p><div class="badge badge-secondary popupText"><i class="far fa-calendar"></i> Bell'Italia n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MM/YYYY")}}</div><br><div class="mt-4"><a :href="/interest/+interest.id"><i class="far fa-edit"></i> Modifier</a><span class="ml-4 deleteLink" @click="deleteButton($event, interest.id)"><i class="far fa-trash-alt deleteLink"></i> Supprimer</span></div></l-popup>
  </l-marker>
</div>
</div>

</l-map>
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

import marker from '../assets/marker.png'

export default {
  name: 'InterestMap',
  data: function() {
    return {
      zoom: 5.5,
      maxZoom: 15,
      center: [41.89591, 12.508798],
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
    // Récupération des régions en BDD
    getRegions() {
      axios.get('http://127.0.0.1:8000/api/region')
      .then(response => (this.storedRegions = response.data))
    },
    // Cocher toutes les régions dans le filtre
    allRegions: function(){
      if(this.checkedRegions.length==0) {
        this.storedRegions.forEach((storedRegion, index) => {
          this.checkedRegions.push(storedRegion.name)
        })
      } else {
        this.checkedRegions = []
      }
    },
    // Méthode pour recentrer la carte via bouton dédié
    recenterMap: function(){
      this.$nextTick(() => {
        this.$refs.myMap.mapObject.flyTo([41.89591, 12.508798], 6)
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
},
created: function(){
  this.getRegions()
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

.select-regions {
  background-color: white;
  padding:1em;
}

</style>

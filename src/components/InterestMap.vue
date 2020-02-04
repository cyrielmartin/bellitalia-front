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
      <!-- Marqueurs -->
      <l-marker
      :key="interestIndex"
      v-for="(interest,interestIndex) in interests"
      :lat-lng="latLng(interest.latitude, interest.longitude)">
      <!-- Icône pour marqueurs -->
      <l-icon :icon-size="interest.iconSize" :icon-url="icon">
      </l-icon>
            <!-- <l-popup :options="{ autoClose: false, closeOnClick: false }" -->
      <l-popup :options="{ keepInView: true}"><div><span  :key="interestTag" v-for="(tag, interestTag) in interest.tags" class="badge badge-warning mr-1 popupText">{{tag.name}}</span></div><h1 class="mt-3 mb-3">{{interest.name}}</h1><img :src="interest.image" width="300" class="popupImage"/><div class="badge badge-info popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span :key="interestRegion" v-for="(region, interestRegion) in interest.city">{{region.name}}</span></div><p class="popupText">{{interest.description}}</p><p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link"><i class="fas fa-external-link-alt"></i> Lien</a></p><div class="badge badge-secondary popupText"><i class="far fa-calendar"></i> Bell'Italia n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MM/YYYY")}}</div><br><div class="mt-4"><a :href="/interest/+interest.id"><i class="far fa-edit"></i> Modifier</a><span class="ml-4 deleteLink" @click="deleteButton($event, interest.id)"><i class="far fa-trash-alt deleteLink"></i> Supprimer</span></div></l-popup>
    </l-marker>
  </l-map>
  <modal name="delete">
  </modal>
  <v-dialog/>
</div>
</div>

</template>

<script>

import { LMap, LTileLayer, LMarker, LIcon, LPopup } from 'vue2-leaflet'
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
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,

  },
  methods: {
    // popupclose: function(){
    //   console.log('popupclose');
    // },
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

</style>

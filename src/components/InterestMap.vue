<template>
  <div class="">
    <div class="row map">
      <!-- Affichage de la position réelle -->
      <!-- <small>{{currentCenter}}</small> -->
      <!-- Affichage de la carte -->
      <l-map
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

      <l-popup><div><span  :key="interestTag" v-for="(tag, interestTag) in interest.tags" class="badge badge-warning mr-1 popupText">{{tag.name}}</span></div><h1 class="mt-3 mb-3">{{interest.name}}</h1><div class="badge badge-info popupText"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span>, <span :key="interestRegion" v-for="(region, interestRegion) in interest.city">{{region.name}}</span></div><p class="popupText">{{interest.description}}</p><p><a class="popupText" target="_blank" rel="noopener noreferrer" :href="linkUrl+interest.link">Lien</a></p><div class="badge badge-secondary popupText"><i class="far fa-calendar"></i> Bell'Italia n°{{interest.bellitalia.number}}, {{interest.bellitalia.publication | moment("MM/YYYY")}}</div><div class="mt-4"><a :href="/interest/+interest.id">Modifier</a></div></l-popup>
    </l-marker>
  </l-map>
</div>

</div>

</template>

<script>

import { LMap, LTileLayer, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import L from 'leaflet'

import marker from '../assets/marker.png'

export default {
  name: 'InterestMap',
  data: function() {
    return {
      zoom: 5.5,
      maxZoom: 15,
      center: L.latLng(41.89591, 12.508798),
      currentCenter: L.latLng(41.89591, 12.508798),
      url: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(41.89591, 12.508798),
      icon: marker,
      iconSize: [30, 30],
      href:'',
      linkUrl: 'https://'
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
    latLng: function(lat, lng) {
      return L.latLng(lat, lng)
    },
    centerUpdate: function(center) {
      this.currentCenter = center
    }
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
  height: 95vh;
}

.popupText {
  font-size: 0.8rem;
}

</style>

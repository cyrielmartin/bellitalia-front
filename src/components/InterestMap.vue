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
      :key="index"
      v-for="(interest,index) in interests"
      :lat-lng="latLng(interest.latitude, interest.longitude)">
      <!-- Icône pour marqueurs -->
      <l-icon :icon-size="interest.iconSize" :icon-url="icon">
      </l-icon>
      <l-popup><span v-for="tag in interest.tags" class="badge badge-warning mr-1">{{tag.name}}</span><h1>{{interest.name}}</h1><p>{{interest.description}}</p><div class="badge badge-info"><span><i class="fas fa-location-arrow"></i> {{interest.city.name}}</span> (<span v-for="region in interest.city">{{region.name}}</span>)</div></l-popup>
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

</style>

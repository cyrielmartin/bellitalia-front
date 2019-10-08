<template>

  <div class="row map">
    <!-- Affichage de la position réelle -->
    <small>{{currentCenter}}</small>
    <!-- Affichage de la carte -->
    <l-map @update:center="centerUpdate"
           :zoom="zoom"
           :center="center">
      <!-- Surcouche OSM -->
      <l-tile-layer :url="url" :attribution="attribution">
      </l-tile-layer>
      <!-- Marqueurs -->
      <l-marker :key="index"
                v-for="(interest,index) in interests"
                :lat-lng="latLng(interest.latitude, interest.longitude)">
        <!-- Icône pour marqueurs -->
        <l-icon :icon-size="iconSize" :icon-url="icon">
        </l-icon>
      </l-marker>
    </l-map>
  </div>

</template>

<script>

  import axios from 'axios'
  import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'

  import ruin from '../assets/ruin.png'

  export default {
    name: 'InterestMap',
    props: {
      interests: Array
    },
    data: function() {
      return {
        zoom: 5.5,
        center: L.latLng(41.89591, 12.508798),
        currentCenter: L.latLng(41.89591, 12.508798),
        url: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: L.latLng(41.89591, 12.508798),
        icon: ruin,
        iconSize: [30, 30]
      }
    },
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LIcon
    },
    methods: {
      latLng: function(lat, lng) {
        return L.latLng(lat, lng)
      },
      centerUpdate: function(center) {
        this.currentCenter = center
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .map {
    height: 95vh;
  }

</style>

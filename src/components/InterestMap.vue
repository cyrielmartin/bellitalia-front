<template>
  <div class="row map">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="marker"></l-marker>
    </l-map>
  </div>
</template>

<script>

import axios from 'axios';
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'InterestMap',
  data: function() {
    return {
      zoom:5.5,
      center: L.latLng(41.895910, 12.508798),
      url:'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(41.895910, 12.508798),
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.map {
  height: 95vh;
}
</style>

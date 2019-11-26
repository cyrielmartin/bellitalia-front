<template>

  <div class="container-fluid">
    <!-- Header -->
    <div class="row">
      <div class="col-12">
        <div class="text-center text-info title">Bell'Italia</div>
      </div>
    </div>
    <!-- L'affichage des composants est géré par le router -->
    <router-view></router-view>
  <FlashMessage position="left bottom"/>
  </div>

</template>

<script>

// Comme on passe par le router, plus besoin des infos du export default, en revanche il faut le garder, meme vide
export default {}

</script>

<style>
.title {
  font-size: 3rem;
}

</style>

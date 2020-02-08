<template>

  <div class="container-fluid">
    <!-- Header -->
    <div class="row">
      <a href="/" class="col-12" id="banner"></a>
        <!-- <a href="/" class="text-center text-info title"><div >Bell'Italia</div></a> -->

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

#banner{
  background: url('./assets/bellitalia.png') no-repeat center;
  background-size: 47%;
  padding-bottom: 10em;
}
.title {
  font-size: 3rem;
}
a:hover {
  text-decoration: none;
}

</style>

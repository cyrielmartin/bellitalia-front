<template>

  <div class="container-fluid">
    <!-- Header -->
    <div class="row">
      <a href="/" class="col-6" id="banner"></a>
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
  background-size: 100%;
  padding-bottom: 10em;
  margin: auto;
}
.title {
  font-size: 3rem;
}
a:hover {
  text-decoration: none;
}

@media screen and (min-width: 1400px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 80%;
    padding-bottom: 10em;
    margin: auto;
  }
}

@media screen and (min-width: 1850px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 65%;
    padding-bottom: 13em;
    margin: auto;
  }
}

@media screen and (max-width: 1000px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 7em;
    margin: auto;
  }
}

</style>

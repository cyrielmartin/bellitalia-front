<template>

  <div class="container-fluid">
    <!-- Header -->
    <div class="row">
      <a href="/" id="banner"></a>
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

* {
  font-family: "NewCaledoniaLTStd";
}
.title {
  font-size: 3rem;
}
a:hover {
  text-decoration: none;
}

/* // Small devices (landscape phones, 100px and up) */
@media (min-width: 100px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 4em;
    display: inline-block;
    width: 70%;
  }
}

/* // Small devices (landscape phones, 300px and up) */
@media (min-width: 300px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 5em;
    display: inline-block;
    width: 65%;
  }
}

/* // Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 6em;
    display: inline-block;
    width: 60%;
  }
}

/* // Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 7em;
    display: inline-block;
    width: 55%;
  }
}

/* // Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 8em;
    display: inline-block;
    width: 50%;
  }
}

/* // Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 9em;
    display: inline-block;
    width: 45%;
  }
}

/* // Extra large devices (large desktops, 1500px and up) */
@media (min-width: 1500px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 10em;
    display: inline-block;
    width: 40%;
  }
}

/* // Extra large devices (large desktops, 1900px and up) */
@media (min-width: 1900px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 11em;
    display: inline-block;
    width: 35%;
  }
}

/* // Extra large devices (large desktops, 2200px and up) */
@media (min-width: 2200px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 12em;
    display: inline-block;
    width: 30%
  }
}

/* // Extra large devices (large desktops, 2500px and up) */
@media (min-width: 2500px) {
  #banner{
    background: url('./assets/bellitalia.png') no-repeat center;
    background-size: 100%;
    padding-bottom: 13em;
    display: inline-block;
    width: 25%
  }
}

@font-face {
  font-family: "NewCaledoniaLTStd";
  src: url("/font/NewCaledoniaLTStd.otf");
}

/* @media screen and (min-width: 1400px) {
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
} */

</style>

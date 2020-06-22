<template>
  <div class="container">
    <a href="/"><b-button type="button"><i class="fas fa-arrow-circle-left"></i> Retour</b-button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <span class="formTitle">Gérer les catégories</span>
        <div class="card-body">
          ICI LE DATATABLE
          <!-- {{tags}} -->
          <div class="" v-for="tag in tags">
            Nom du tag {{tag.name}}<br>
            Créé le {{tag.created_at | moment("DD MMMM YYYY")}}<br>
            Nombre de points d'intérêt associés {{tag.interests.length}}<br>
            <br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Tags',
  data:function(){
    return {
      tags:[],
    }
  },
  mounted: function() {
    axios
    .get('http://127.0.0.1:8000/api/tag')
    .then(r => {
      this.tags = r.data.data
    })
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.formTitle{
  font-size: 1.6em;
  display: flex;
  justify-content: center;
}
</style>

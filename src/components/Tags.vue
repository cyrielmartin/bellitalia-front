<template>
  <div class="container">
    <a href="/"><b-button type="button"><i class="fas fa-arrow-circle-left"></i> Retour</b-button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <span class="formTitle">Gérer les catégories</span>
        <div class="card-body">

          <div class="col-xs-12">
            <div class="form-group datatableFilterInput">
              <label for="filter" class="sr-only">Filter</label>
              <input type="text" class="form-control" v-model="datatableFilter" placeholder="Recherche" @keydown="$event.stopImmediatePropagation()">
            </div>
          </div>

          <div class="col-xs-12 table-responsive">
            <datatable :columns="columns" :data="tags" :filter="datatableFilter" :per-page="25"></datatable>
            <datatable-pager v-model="datatablePage"></datatable-pager>
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
      datatableFilter:'',
      datatablePage: 1,
      columns: [
        {label: 'Nom de la catégorie', field: 'name', headerClass: 'class-in-header second-class', align: 'center'},
        {label: 'Nombre de points d\'intérêt associés', field: 'interests.length', align: 'center'},
        {label: 'Actions', representedAs: row => `<i class="far fa-edit"></i> <i class="far fa-trash-alt"></i>`, align: 'center', interpolate: true, sortable: false},
      ],
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
.datatableFilterInput{
  max-width: 14em;
  margin: auto auto 1em auto;
}
</style>

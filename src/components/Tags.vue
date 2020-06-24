<template>
  <div class="container">
    <a href="/"><b-button type="button"><i class="fas fa-arrow-circle-left"></i> Retour</b-button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <span class="formTitle">Gérer les catégories</span>
        <div class="card-body">

          <div class="col-xs-12">
            <div class="form-group tableFilterInput">
              <input type="text" class="form-control" v-model="tableFilterInput" placeholder="Rechercher">
            </div>
          </div>

          <b-table
          id="table"
          :fields="tableFields"
          :items="tags"
          :per-page="tablePerPage"
          :current-page="tableCurrentPage"
          sort-icon-left
          responsive
          :filter="tableFilterInput"
          :filterIncludedFields="tableFilterIncludedFields"
          ></b-table>

          <b-pagination
          v-model="tableCurrentPage"
          align="right"
          :total-rows="rows"
          :per-page="tablePerPage"
          aria-controls="table"
          ></b-pagination>

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
      tableCurrentPage: 1,
      tablePerPage:25,
      tableFilterInput:'',
      tableFilterIncludedFields:['name'],
      tableFields: [
        {
          key: 'name',
          label:'Nom',
          sortable: true
        },
        {
          key: 'interests.length',
          label:'Nombre de points d\'intérêt associés',
        },
        {
          key: 'actions',
          label: 'Actions'
        },
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
  computed:{
    rows(){
      return this.tags.length
    }
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
.tableFilterInput{
  max-width: 14em;
  margin: auto auto 1em auto;
}
.toto{
  color: red;
}
</style>

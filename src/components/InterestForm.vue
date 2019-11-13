<template>

  <div class="container">
    <a href="/"><button type="button" class="btn btn-outline-dark"><i class="fas fa-arrow-circle-left"></i> Retour</button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header">Ajouter un nouveau point d'intérêt</div>

          <div class="card-body">

            <form
            @submit.prevent="submitForm"
            novalidate="true">
            <div class="form-group">
              <label>Nom du point d'intérêt *</label>
              <input class="form-control" v-model="interestName" :class="{'border-red': errors.name}">
              <p class="text-error" v-if="errors.name" v-text="errors.name[0]"></p>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea cols="50" rows="5" class="form-control" v-model="interestDescription"></textarea>
            </div>

            <div class="form-group">
              <label>Lien</label>
              <input class="form-control" v-model="interestLink">
            </div>

            <div class="form-group">
              <label>Latitude *</label>
              <input type="number" min="0" max="100" step="1.0E-7" class="form-control" v-model="interestLatitude" :class="{'border-red': errors.latitude}">
              <p class="text-error" v-if="errors.latitude" v-text="errors.latitude[0]"></p>
            </div>

            <div class="form-group">
              <label>Longitude *</label>
              <input type="number" min="0" max="100" step="1.0E-8" class="form-control" v-model="interestLongitude" :class="{'border-red': errors.longitude}">
              <p class="text-error" v-if="errors.longitude" v-text="errors.longitude[0]"></p>
            </div>

            <div class="form-group">
              <label>Ville *</label>
              <input class="form-control" v-model="interestCity" :class="{'border-red': errors.city_id}">
              <p class="text-error" v-if="errors.city_id" v-text="errors.city_id[0]"></p>
            </div>

            <div class="form-group">
              <label>Région *</label>
              <select class="form-control" v-model="interestRegion" :class="{'border-red': errors.region_id}">
                <option disabled value="">Sélectionner</option>
                <option v-for='region in regions.data' :key="region.index"> {{ region.name }} </option>
              </select>
              <p class="text-error" v-if="errors.region_id" v-text="errors.region_id[0]"></p>
            </div>

            <div class="form-group">
              <label>Numéro du Bell'Italia *</label>
              <input type="number" class="form-control" v-model="interestNumber" :class="{'border-red': errors.bellitalia_id}">
              <p class="text-error" v-if="errors.bellitalia_id" v-text="errors.bellitalia_id[0]"></p>
            </div>

            <div class="form-group">
              <label>Date de publication du Bell'Italia *</label>
              <input type="date" class="form-control" v-model="interestDate" :class="{'border-red': errors.publication}">
              <p class="text-error" v-if="errors.publication" v-text="errors.publication[0]"></p>
            </div>

            <div class="form-group">
              <div>
                <label>Catégorie</label>
                <multiselect v-model="value" tag-placeholder="Créer cette nouvelle catégorie" placeholder="Sélectionner ou créer une catégorie" label="name" track-by="name" :options="tags" :multiple="true" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addTag"></multiselect>
              </div>
            </div>

            <div class="form-group">
              <label>Catégorie</label>
              <input class="form-control" v-model="interestCategory">
              <p class="text-error" v-if="errors.category_id" v-text="errors.category_id[0]"></p>
            </div>

            <div class="d-flex justify-content-center">
              <button type="submit" class="btn btn-fill btn-blue">Enregistrer</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import axios from 'axios'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  name: 'InterestForm',
  data() {
    return {
      value:[],
      interestName: '',
      interestDescription:'',
      interestLink:'',
      interestLatitude:'',
      interestLongitude:'',
      interestCity:'',
      interestRegion:'',
      interestNumber:'',
      interestDate:'',
      interestCategory:'',
      errors: {},
      regions: [],
      tags: [],
    }
  },

  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
      }
      this.tags.push(tag);
      this.value.push(tag);
      // <TODO>Axios Post tags pour ajouter en base le tag nouvellement créé</TODO>
    },
    getTags() {
      axios.get('http://127.0.0.1:8000/api/tag')
      .then(response => (this.tags = response.data))

    },
    getRegions() {
      axios.get('http://127.0.0.1:8000/api/region')
      .then(response => (this.regions = response))
    },
    submitForm() {
      axios.post('http://127.0.0.1:8000/api/interest', {
        name: this.interestName,
        description: this.interestDescription,
        link: this.interestLink,
        latitude: this.interestLatitude,
        longitude: this.interestLongitude,
        city_id: this.interestCity,
        region_id: this.interestRegion,
        bellitalia_id: this.interestNumber,
        publication: this.interestDate,
        category_id: this.interestCategory,

      })
      .then(() => {
        this.interestName = ""
        this.interestDescription = ""
        this.interestLink = ""
        this.interestLatitude = ""
        this.interestLongitude = ""
        this.interestCity = ""
        this.interestRegion = ""
        this.interestNumber = ""
        this.interestDate = ""
        this.interestCategory = ""
        this.errors = {}
        this.$router.push('/')
        this.flashMessage.show({
          status: 'success',
          title: 'Confirmation',
          message: 'Le point d\'intérêt a bien été enregistré'
        });
      })
      .catch(error => {
        this.errors = error.response.data
      })
    },
  },
  mounted: function(){
    this.getRegions();
    this.getTags();
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped >

.text-error {
  color: red;
}
.border-red {
  border-color: red;
}
</style>

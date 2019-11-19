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
              <input type="number" @keyup="checkIfNumber" min="0" max="100" step="1.0E-7" class="form-control" v-model.number="interestLatitude" :class="{'border-red': errors.latitude}">
              <p class="text-error" v-if="errors.latitude" v-text="errors.latitude[0]"></p>
            </div>

            <div class="form-group">
              <label>Longitude *</label>
              <input type="number" @keyup="checkIfNumber" min="0" max="100" step="1.0E-8" class="form-control" v-model="interestLongitude" :class="{'border-red': errors.longitude}">
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
              <div>
                <label>Numéro du Bell'Italia *</label>
                <multiselect v-model="interestNumber" tag-placeholder="Créer cette nouvelle publication" placeholder="Sélectionner ou créer une publication" label="number" track-by="number" :options="storedPublications" :multiple="false" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addPublication" id="number" :class="{'border-red': errors.bellitalia_id}"></multiselect>
                <p class="text-error" v-if="errors.bellitalia_id" v-text="errors.bellitalia_id[0]"></p>
              </div>
            </div>

            <!-- Plugin vue-js-modal gérant l'ajout dynamique de nouveaux numéros BI + date publication -->
            <modal name="publication">
            </modal>
            <v-dialog/>

            <div class="form-group">
              <div>
                <label>Catégorie(s)</label>
                <!-- Catégories/Tags gérés grâce à plugin Vue Multiselect -->
                <multiselect v-model="interestTag" tag-placeholder="Créer cette nouvelle catégorie" placeholder="Sélectionner ou créer une catégorie" label="name" track-by="name" :options="storedTags" :multiple="true" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addTag"></multiselect>
              </div>
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
import VueMonthlyPicker from 'vue-monthly-picker'

export default {
  components: {
    Multiselect,
    VueMonthlyPicker
  },
  name: 'InterestForm',
  data() {
    return {
      interestTag: [],
      storedTags: [],
      interestName: '',
      interestDescription:'',
      interestLink:'',
      interestLatitude:'',
      interestLongitude:'',
      interestCity:'',
      interestRegion:'',
      interestNumber:[],
      storedPublications: [],
      interestDate: '',
      errors: {},
      regions: [],
      monthLabels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    }
  },

  methods: {
    checkIfNumber() {
      console.log('checkIfNumber')
    },
    // Ajout dynamique d'un tag en cours de saisie du formulaire
    addTag(newTag) {
      const createdTag = {
        name: newTag,
      }
      this.storedTags.push(createdTag);
      this.interestTag.push(createdTag);
      axios.post('http://127.0.0.1:8000/api/tag', {
        tag_id: this.interestTag,
      })
    },
    // Récupération des tags en BDD
    getStoredTags() {
      axios.get('http://127.0.0.1:8000/api/tag')
      .then(response => (this.storedTags = response.data))
    },
    addPublication(newPublication) {
      // console.log(typeof(Number(document.querySelector('input#number').value)))
      this.$modal.show('dialog', {
        title: 'Création d\'une publication',
        text: '<p>Merci de préciser la date de parution du n°<strong>'+newPublication+ '</strong> de Bell\'Italia : </p><input id="date" type="date" class="form-control" v-model="interestDate">',
        buttons: [
          {
            title: 'Enregistrer',
            handler: () => {
              axios.post('http://127.0.0.1:8000/api/bellitalia', {
                number: newPublication,
                date: document.querySelector('input#date').value,
              }).then(() => this.hideModal())
            }
          },
          {
            title: 'Annuler',
          }
        ]
      })
    },
    hideModal () {
      this.$modal.hide('dialog')
    },
    // Récupération des publications BI en BDD
    getStoredPublications() {
      axios.get('http://127.0.0.1:8000/api/bellitalia')
      .then(response => (this.storedPublications = response.data))
    },
    // Récupération des régions en BDD
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
        tag_id: this.interestTag,
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
    this.getStoredTags();
    this.getStoredPublications();

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

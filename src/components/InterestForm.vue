<template>

  <div class="container">
    {{interest}}

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
              <label>Nom du point d'intérêt <span class="redStar">*</span></label>
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
              <label>Latitude <span class="redStar">*</span></label>
              <input id="latitude" min="0" max="100" step="1.0E-7" class="form-control latitude" v-model="interestLatitude" :class="{'border-red': errors.latitude}">
              <small class="helpText">La saisie des lettres est désactivée</small>
              <p class="text-error" v-if="errors.latitude" v-text="errors.latitude[0]"></p>
            </div>

            <div class="form-group">
              <label>Longitude <span class="redStar">*</span></label>
              <input id="longitude" min="0" max="100" step="1.0E-8" class="form-control" v-model="interestLongitude" :class="{'border-red': errors.longitude}">
              <small class="helpText">La saisie des lettres est désactivée</small>
              <p class="text-error" v-if="errors.longitude" v-text="errors.longitude[0]"></p>
            </div>

            <div class="form-group">
              <label>Ville <span class="redStar">*</span></label>
              <input class="form-control" v-model="interestCity" :class="{'border-red': errors.city_id}">
              <p class="text-error" v-if="errors.city_id" v-text="errors.city_id[0]"></p>
            </div>

            <div class="form-group">
              <label>Région <span class="redStar">*</span></label>
              <select class="form-control helpText" v-model="interestRegion" :class="{'border-red': errors.region_id}">
                <option disabled value="">Sélectionner</option>
                <option v-for='region in regions.data' :key="region.index"> {{ region.name }} </option>
              </select>
              <p class="text-error" v-if="errors.region_id" v-text="errors.region_id[0]"></p>
            </div>

            <div class="form-group">
              <div>
                <!-- L'ajout d'une publication se fait au moyen de Vue Multiselect surchargé en JS -->
                <label>Numéro du Bell'Italia <span class="redStar">*</span></label>
                <multiselect v-model="interestNumber" tag-placeholder="Créer cette nouvelle publication" placeholder="Sélectionner ou créer une publication" label="number" track-by="number" :options="storedPublications" :multiple="false" :options-limit="1" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addPublication" id="number" :class="{'border-red': errors.bellitalia_id}"></multiselect>
                <p class="text-error" v-if="errors.bellitalia_id" v-text="errors.bellitalia_id[0]"></p>
                <p class="text-error" v-show="NotANumber">Veuillez saisir un numéro de publication</p>
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
            <span class="helpText">Les champs marqués d'une <span class="redStar">*</span> sont obligatoires.</span>
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
    Multiselect,
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
      storedPublications:[],
      interestDate: '',
      errors: {},
      regions: [],
      NotANumber: false,
      monthLabels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    }
  },

  methods: {
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
    // Ajout d'une nouvelle publication à la volée
    addPublication(newPublication) {
      const createdPublication = {
        number: newPublication,
      }
      // Le JS empêche la saisie de lettres, mais la 1ère est quand même pris en compte par Multiselect.
      // Donc on bloque l'ajout de moins de 2 charactères
      if(newPublication.length<2) {
        // Si moins de 2 charactères, on affiche le message d'erreur
        this.NotANumber = true
      } else {
        //Et on l'affiche dans l'input
        this.interestNumber.push(createdPublication)
        //On enlève le message d'erreur s'il était présent
        this.NotANumber = false
        //Et à la validation de la nouvelle publication, on ouvre la modale pour ajouter la date
        this.$modal.show('dialog', {
          title: 'Création d\'une publication',
          text: '<p>Merci de préciser la date de parution du n°<strong>'+newPublication+ '</strong> de Bell\'Italia : </p><input id="date" type="date" class="form-control" v-model="interestDate"><small>Seuls le mois et l\'année seront enregistrés</small>',
          buttons: [
            {
              title: 'Enregistrer',
              //On envoie tout ça à l'API pour enregistrement
              handler: () => {
                axios.post('http://127.0.0.1:8000/api/bellitalia', {
                  number: newPublication,
                  date: document.querySelector('input#date').value,
                  //On referme la modale
                }).then(() =>
                this.hideModal())
                //Et on ajoute dynamiquement au menu déroulant la publication que l'on vient de créer
                this.storedPublications.push(createdPublication)
              }
            },
            {
              // Dans le cas où on clique sur Annuler, on vide l'input et on ferme la modale
              handler:()=> {this.interestNumber.pop(), this.hideModal()},
              title: 'Annuler',
            }
          ]
        })
      }
    },
    //Petite méthode gérant la fermeture de la modale
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
        this.NotANumber = false
      })
    },
    getInterest() {
      axios.get('http://127.0.0.1:8000/api/interest/'+this.$route.params.id)
      .then(r => {
        this.interest = r.data.data
        this.interestName = r.data.data.name
        this.interestDescription = r.data.data.description
        this.interestLink = r.data.data.link
        this.interestLatitude = r.data.data.latitude
        this.interestLongitude = r.data.data.longitude
        this.interestCity = r.data.data.city.name
        this.interestRegion = r.data.data.city.region_id.name
      })
    },
  },
  created: function(){
    this.getInterest();
  },
  mounted: function(){
    this.getRegions();
    this.getStoredTags();
    this.getStoredPublications();

    // Méthode JS empêchant de saisir autre chose que des chiffres
    function setInputFilter(textbox, inputFilter) {
      ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          }
        });
      });
    }
    // On applique cette méthode sur notre input numéro de Bell'Italia
    setInputFilter(document.getElementById("number"), function(value) {
      return /^\d*$/.test(value); }),

      //On applique une méthode légèrement différente pour la latitude et la longitude (que des chiffres + points et virgules)
      setInputFilter(document.getElementById("latitude"), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); })

        setInputFilter(document.getElementById("longitude"), function(value) {
          return /^-?\d*[.,]?\d*$/.test(value); })
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
      .helpText {
        color: #ADADAD;
      }
      .redStar {
        color:red;
      }
      </style>

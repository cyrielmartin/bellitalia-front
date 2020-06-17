<template>

  <div class="container">

    <a href="/"><b-button type="button"><i class="fas fa-arrow-circle-left"></i> Retour</b-button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <span class="formTitle" v-if="!edit">Ajouter un nouveau point d'intérêt</span>
        <span class="formTitle" v-if="edit">Modifier un point d'intérêt</span>

        <div class="card-body">
          <form
          novalidate="true">
          <div class="form-group">
            <label>Nom du point d'intérêt <span class="redStar">*</span></label>
            <input class="form-control" v-model="interestName" :class="nameErrorClass" @click="inputNameChange">
            <p id="name-error" :class="nameErrorTextClass" v-if="errors.name" v-text="errors.name[0]"></p>
          </div>

          <div class="form-group">
            <label>Adresse <span class="redStar">*</span><span><i v-b-tooltip.hover.right title="Ce champ ne peut pas être modifié" class="fas fa-info-circle informationLogo"></i></span></label>
            <input disabled class="form-control" v-model="interestAddress" :class="addressErrorClass" @click="inputAddressChange">
            <p id="address-error" :class="addressErrorTextClass" v-if="errors.address" v-text="errors.address[0]"></p>
          </div>

          <div class="row container-fluid mb-3" style="gap:1%;">
            <div class="">
              <label>Latitude <span class="redStar">*</span><span><i v-b-tooltip.hover.right title="Ce champ ne peut pas être modifié" class="fas fa-info-circle informationLogo"></i></span></label>
              <input disabled min="0" max="100" step="1.0E-7" class="form-control latitude" v-model="interestLatitude" :class="latitudeErrorClass" @click="inputLatitudeChange">
              <!-- <small class="helpText">Le séparateur décimal doit être un point</small><br/>
              <small class="helpText">La saisie des lettres est désactivée</small> -->
              <p :class="latitudeErrorTextClass" v-if="errors.latitude" v-text="errors.latitude[0]"></p>
            </div>

            <div class="">
              <label>Longitude <span class="redStar">*</span><span><i v-b-tooltip.hover.right title="Ce champ ne peut pas être modifié" class="fas fa-info-circle informationLogo"></i></span></label>
              <input disabled min="0" max="100" step="1.0E-8" class="form-control" v-model="interestLongitude" :class="longitudeErrorClass" @click="inputLongitudeChange">
              <!-- <small class="helpText">Le séparateur décimal doit être un point</small><br/>
              <small class="helpText">La saisie des lettres est désactivée</small> -->
              <p :class="longitudeErrorTextClass" v-if="errors.longitude" v-text="errors.longitude[0]"></p>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea cols="50" rows="5" class="form-control" v-model="interestDescription"></textarea>
          </div>

          <div class="form-group">
            <label>Image(s)</label>
            <div v-if="interestImageArray.length<1">
              <input type="file" enctype='multipart/form-data' accept="image/jpeg, image/jpg, image/png" multiple @change="onInterestFileChange">
            </div>
            <div v-else>
              <!-- Pour le zoom et la visualisation des images chargées, j'utilise v-viewer  -->
              <div class="interestImageArrayClass" v-viewer="viewerInterestOptions">
                <img class="interestImageClass" v-for="image,imageIndex in interestImageArray" :src="image"/>
              </div>
              <button class="btn btn-outline-danger" @click="removeInterestImage"><i class="far fa-trash-alt imageTrash"></i></button>
            </div>
            <small class="helpText">L'image (jpg, jpeg ou png) ne doit pas peser plus de 30Mo</small><br/>
            <p class="text-error" v-if="errors.image" v-text="errors.image[0]"></p>
            <!-- Si une erreur autre que validator est détectée, j'affiche un message par défaut -->
            <!-- J'ai dû mettre ça en place pour éviter que les fichiers manipulés puissent duper le validator -->
            <!-- Fichiers manipulés = pdf artificiellement changé en jpg, par exemple -->
            <p class="text-error" v-if="this.interestImageError" >Format non reconnu ou invalide. Veuillez charger un autre fichier.</p>

          </div>

          <div>

          </div>

          <div class="form-group">
            <label>Lien</label>
            <input class="form-control" v-model="interestLink">
          </div>

          <!-- Les input publication/supplément ne peuvent et ne doivent pas être saisis en même temps. C'est l'un ou l'autre. Donc mise en place d'un radio pour passer de l'un à l'autre. -->
          <b-form-group>
            <b-form-radio :class="publicationRadio" v-model="selectedPublication" name="selectedPublication" value="publication">Numéro du Bell'Italia <span :class="publicationRedStar">*</span></b-form-radio>

            <div class="form-group">
              <div>
                <!-- L'ajout d'une publication se fait au moyen de Vue Multiselect surchargé en JS -->
                <multiselect :disabled="publicationInputDisabled" v-model="interestNumber" tag-placeholder="Créer cette nouvelle publication" placeholder="Sélectionner ou créer une publication" label="number" :custom-label="numberWithPublication" track-by="number" :options="storedPublications" :multiple="false" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" :allow-empty="false" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addPublication" id="number" :class="publicationErrorClass" @open="inputPublicationChange">
                  <span slot="noOptions">Aucune publication</span>
                </multiselect>
                <small class="helpText">Seuls les chiffres sont acceptés</small><br/>
                <p :class="publicationErrorTextClass" v-if="errors.bellitalia_id" v-text="errors.bellitalia_id[0]"></p>
              </div>
            </div>
            <!-- Input supplément -->
            <b-form-radio :class="supplementRadio" v-model="selectedPublication" name="selectedPublication" value="supplement">Supplément/Hors-Série <span :class="supplementRedStar">*</span></b-form-radio>

            <div class="form-group">
              <div>
                <!-- L'ajout d'un supplément se fait au moyen de Vue Multiselect surchargé en JS -->
                <multiselect :disabled="supplementInputDisabled" v-model="interestSupplement" tag-placeholder="Créer ce nouveau supplément" placeholder="Sélectionner ou créer un supplément" label="name" :custom-label="nameWithPublication" track-by="name" :options="storedSupplements" :multiple="false" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addSupplement" id="name" :class="supplementErrorClass" @open="inputSupplementChange">
                  <span slot="noOptions">Aucun supplément</span>
                </multiselect>
                <!-- <small class="helpText">Seuls les chiffres sont acceptés</small><br/> -->
                <p :class="supplementErrorTextClass" v-if="errors.supplement_id" v-text="errors.supplement_id[0]"></p>
              </div>
            </div>

          </b-form-group>

          <!-- Modal d'ajout d'une publication -->
          <b-modal
          ref="addPublicationModal"
          id="addPublicationModal"
          title="Ajout d'un nouveau numéro"
          ok-title="Valider"
          :ok-disabled="okDisabledPublicationModal"
          cancel-title="Annuler"
          size="lg"
          button-size="sm"
          no-close-on-esc
          @ok="handleOkPublicationModal"
          @cancel="handleCancelPublicationModal"
          >

          <b-container fluid>

            <!-- Message d'erreur affiché si le numéro contient une lettre -->
            <div class="text-error" v-if="NotANumberPublicationModal">Le numéro saisi n'est pas valide (présence d'une lettre). Veuillez saisir un autre numéro.</div>

            <!-- Tout le reste de la modale ne s'affiche que si le numéro envoyé ne contient pas de lettre -->
            <div v-if="!NotANumberPublicationModal">
              <div class="mb-3">Merci de définir la date de parution du n° <strong>{{this.interestNumber[0]}}</strong> :<span class="redStar"> *</span></div>
              <!-- Month Picker pour date publication -->
              <vue-monthly-picker
              v-model="selectedMonthPublicationModal"
              dateFormat="MMMM YYYY"
              :monthLabels="monthLabelsPublicationModal"
              @selected="monthSelectedPublicationModal"
              placeHolder="Cliquez ici pour sélectionner une date de publication"
              id="month-picker"
              >
            </vue-monthly-picker>

            <!-- Message d'erreur si pb validation date front -->
            <div class="text-error" v-if="NoDatePublicationModal">Vous devez saisir une date de publication.</div>

            <!-- Messages d'erreur si pb validation date back -->
            <p class="text-error" v-if="errors.date" v-text="errors.date[0]"></p>

            <div class="mb-3 mt-3">Merci de définir la couverture du n° <strong>{{this.interestNumber[0]}}</strong> :<span class="redStar"> *</span></div>

            <!-- Upload photo pour couverture publication -->
            <b-form-file
            placeholder="Choisissez un fichier ou déposez-le ici..."
            drop-placeholder="Déposez le fichier ici..."
            browse-text="Choisir un fichier"
            accept="image/jpeg, image/jpg, image/png"
            @change="onPublicationFileChange"
            :state=publicationImageValid
            id="publication-file-form"
            ></b-form-file>
            <small class="helpText">L'image (jpg, jpeg ou png) ne doit pas peser plus de 30Mo</small><br/>
            <!-- Pour le zoom et la visualisation de l'image chargée, j'utilise v-viewer  -->
            <div v-viewer="viewerPublicationOptions" class="mt-4" v-if="publicationImageArray">
              <img v-for="image,imageIndex in publicationImageArray" :src="image" class="previewImage" />
              <button v-b-tooltip.hover.right.v-danger title="Supprimer l'image" class="btn btn-outline-danger deleteImageIcon" @click="removePublicationImage"><i class="far fa-trash-alt imageTrash"></i></button>

            </div>
            <div id="preview" ref="preview"></div>

            <!-- Messages d'erreur si pb validation numéro et image back -->
            <p class="text-error" v-if="errors.image" v-text="errors.image[0]"></p>
            <p class="text-error" v-if="errors.number" v-text="errors.number[0]"></p>

            <!-- Si une erreur autre que validator est détectée, j'affiche un message par défaut -->
            <!-- J'ai dû mettre ça en place pour éviter que les fichiers manipulés puissent duper le validator -->
            <!-- Fichiers manipulés = pdf artificiellement changé en jpg, par exemple -->
            <p class="text-error" v-if="this.error" >Format non reconnu ou invalide. Veuillez charger un autre fichier.</p>

            <span class="helpText">Les champs marqués d'une <span class="redStar">*</span> sont obligatoires.</span>
          </div>
        </b-container>

      </b-modal>

      <!-- Modal d'ajout d'un supplément -->
      <b-modal
      ref="addSupplementModal"
      id="addSupplementModal"
      title="Ajout d'un nouveau supplément"
      ok-title="Valider"
      :ok-disabled="okDisabledSupplementModal"
      cancel-title="Annuler"
      size="lg"
      button-size="sm"
      no-close-on-esc
      @ok="handleOkSupplementModal"
      @cancel="handleCancelSupplementModal"
      >

      <b-container fluid>
        <div class="mb-3">Merci d'associer un numéro de Bell'Italia à ce supplément <strong>{{this.interestSupplement[0]}}</strong> :<span class="redStar"> *</span></div>

        <!-- Select des numéros déjà enregistrés en BDD -->
        <multiselect v-model="interestNumberSupplementModal" placeholder="Sélectionner un numéro existant" :options="storedPublications" :allow-empty="false" :multiple="false" selectLabel="Cliquer ou 'entrée' pour sélectionner" :custom-label="numberWithPublication" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer">
          <span slot="noOptions">Aucune publication</span>
        </multiselect>

        <!-- Messages d'erreur si pas de publication associée -->
        <p class="text-error" v-if="errors.publication" v-text="errors.publication[0]"></p>

        <div class="mb-3 mt-3">Merci de définir la couverture du n° <strong>{{this.interestSupplement[0]}}</strong> :<span class="redStar"> *</span></div>

        <!-- Upload photo pour couverture supplément -->
        <b-form-file
        placeholder="Choisissez un fichier ou déposez-le ici..."
        drop-placeholder="Déposez le fichier ici..."
        browse-text="Choisir un fichier"
        accept="image/jpeg, image/jpg, image/png"
        @change="onSupplementFileChange"
        :state=supplementImageValid
        id="supplement-file-form"
        ></b-form-file>
        <small class="helpText">L'image (jpg, jpeg ou png) ne doit pas peser plus de 30Mo</small><br/>
        <!-- Pour le zoom et la visualisation de l'image chargée, j'utilise v-viewer  -->
        <div v-viewer="viewerSupplementOptions" class="mt-4" v-if="supplementImageArray">
          <img v-for="image,imageIndex in supplementImageArray" :src="image" class="previewImage" />
          <button v-b-tooltip.hover.right.v-danger title="Supprimer l'image" class="btn btn-outline-danger deleteImageIcon" @click="removeSupplementImage"><i class="far fa-trash-alt imageTrash"></i></button>

        </div>
        <div id="preview" ref="preview"></div>

        <!-- Messages d'erreur si pb validation numéro et image back -->
        <p class="text-error" v-if="errors.image" v-text="errors.image[0]"></p>
        <!-- <p class="text-error" v-if="errors.publication" v-text="errors.publication[0]"></p> -->

        <!-- Si une erreur autre que validator est détectée, j'affiche un message par défaut -->
        <!-- J'ai dû mettre ça en place pour éviter que les fichiers manipulés puissent duper le validator -->
        <!-- Fichiers manipulés = pdf artificiellement changé en jpg, par exemple -->
        <p class="text-error" v-if="this.error" >Format non reconnu ou invalide. Veuillez charger un autre fichier.</p>

        <span class="helpText">Les champs marqués d'une <span class="redStar">*</span> sont obligatoires.</span>
      </b-container>

    </b-modal>

    <!-- Catégories/Tags gérés grâce à plugin Vue Multiselect -->
    <div class="form-group">
      <div>
        <label>Catégorie(s) <span class="redStar">*</span></label>
        <multiselect v-model="interestTag" tag-placeholder="Créer cette nouvelle catégorie" placeholder="Sélectionner ou créer une catégorie" label="name" track-by="name" :options="storedTags" :multiple="true" selectLabel="Cliquer ou 'entrée' pour sélectionner" selectedLabel="sélectionné" deselectLabel="Cliquer ou 'entrée' pour retirer" :taggable="true" @tag="addTag" :class="tagErrorClass" @open="inputTagChange">
          <span slot="noOptions">Aucune catégorie</span>
        </multiselect>
        <p :class="tagErrorTextClass" v-if="errors.tag_id" v-text="errors.tag_id[0]"></p>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <b-button type="submit" v-if="!edit" @click.prevent="submitForm">Enregistrer</b-button>
      <b-button type="submit" v-if="edit" @click.prevent="editForm">Enregistrer les modifications</b-button>
    </div>
    <span class="helpText">Les champs marqués d'une <span class="redStar">*</span> sont obligatoires.</span>
  </form>
</div>
</div>
</div>
</div>
<!-- </div> -->
</template>

<script>

import axios from 'axios'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import VueMonthlyPicker from 'vue-monthly-picker'
import 'viewerjs/dist/viewer.css'

export default {
  components: {
    Multiselect,
    VueMonthlyPicker
  },
  name: 'InterestForm',
  data() {
    return {
      selectedPublication: "publication",
      publicationRadio: "mb-2",
      publicationRedStar: 'redStar',
      supplementRedStar: 'redStar',
      error:'',
      publicationImage: '',
      publicationImageArray:[],
      supplementImage: '',
      supplementImageArray:[],
      publicationFile:'',
      interestImage:'',
      interestImageArray:[],
      interestFile:'',
      edit: false,
      interestTag: [],
      storedTags: [],
      storedRegions: [],
      interestName: '',
      interestAddress: '',
      interestDescription:'',
      interestLink:'',
      interestLatitude:'',
      interestLongitude:'',
      interestNumber:[],
      interestNumberSupplementModal:[],
      interestSupplement:[],
      storedPublications:[],
      storedSupplements: [],
      interestDate: '',
      errors: {},
      publicationImageError: false,
      supplementImageError: false,
      interestImageError:false,
      nameErrorClass: "",
      nameErrorTextClass: "",
      addressErrorClass:"",
      addressErrorTextClass: "",
      latitudeErrorClass: "",
      latitudeErrorTextClass: "",
      longitudeErrorClass: "",
      longitudeErrorTextClass: "",
      publicationErrorClass: "",
      publicationErrorTextClass: "",
      imagePublicationErrorClass:"",
      publicationImageValid: null,
      supplementImageValid: null,
      supplementErrorClass: "",
      supplementErrorTextClass:"",
      supplementImageValid: null,
      viewerInterestOptions: {scalable: false},
      viewerPublicationOptions: {scalable: false, navbar: false},
      viewerSupplementOptions: {scalable: false, navbar: false},
      tagErrorClass:"",
      tagErrorTextClass:"",
      newPublication:0,
      createdPublication:{},
      bellitaliaNumber: "",
      NotANumberPublicationModal: false,
      NoDatePublicationModal: false,
      okDisabledPublicationModal: false,
      okDisabledSupplementModal: false,
      selectedMonthPublicationModal: moment(),
      monthLabelsPublicationModal:['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  },
  methods: {
    // Pour affichage numéro + date de publication dans multiselect publication
    numberWithPublication ({ number, publication }) {
      if(number&&publication) {
        return `n°${number}`+ ` (` + moment(`${publication}`).format('MMMM YYYY')+ `)`
      } else {
        return "En cours d'enregistrement"
      }
    },
    // Pour affichage nom supplément + numéro publication associé
    nameWithPublication ({ name, bellitalia_id}) {
      // Rappel : à cette étape, le bellitalia_id désigne le numéro de la publication associée et non l'id
      if(name&&bellitalia_id) {
        return `${name}`+ ` (Bell'Italia n°${bellitalia_id})`
      } else {
        return "En cours d'enregistrement"
      }
    },
    // Méthodes gérant l'affichage des erreurs sur les input
    // Pour chaque input du formulaire
    // Si un message d'erreur est affiché, si la bordure est rouge
    // Au clic sur chaque input :
    // - J'enlève la bordure rouge
    // - J'enlève le message d'erreur
    // Comme tout est réactif, si je revalide et qu'il y a encore des erreurs :
    // les messages et les bordures réapparaissent.
    inputNameChange(){
      this.nameErrorClass = ""
      this.nameErrorTextClass = "text-error-hidden"
    },
    inputAddressChange(){
      this.addressErrorClass = ""
      this.addressErrorTextClass = "text-error-hidden"
    },
    inputLatitudeChange(){
      this.latitudeErrorClass = ""
      this.latitudeErrorTextClass = "text-error-hidden"
    },
    inputLongitudeChange(){
      this.longitudeErrorClass = ""
      this.longitudeErrorTextClass = "text-error-hidden"
    },
    // Petite particularité pour les input Publication et Supplément :
    // Comme ils fonctionnent ensemble, au clic sur l'un des 2, j'enlève les erreurs sur les 2
    inputPublicationChange(){
      this.publicationErrorClass=""
      this.publicationErrorTextClass="text-error-hidden"
      this.supplementErrorClass=""
      this.supplementErrorTextClass="text-error-hidden"
    },
    inputSupplementChange(){
      this.supplementErrorClass=""
      this.supplementErrorTextClass="text-error-hidden"
      this.publicationErrorClass=""
      this.publicationErrorTextClass="text-error-hidden"
    },
    inputTagChange(){
      this.tagErrorClass=""
      this.tagErrorTextClass="text-error-hidden"
    },
    // Validation de la modale d'ajout d'une publication
    handleOkPublicationModal(bvModalEvt) {

      var monthPicker = document.getElementById("month-picker")

      // Double contrôle d'intégrité des données : front et back.
      // Le front est le premier rempart
      // Si on arrive à cette étape, c'est que le numéro est valide côté front
      // (sinon message d'erreur dans la modale qui empêche l'accès à cette méthode)
      // Si la date est bien renseignée, validation front ok, on peut valider la modale
      // L'image est validée via le front pour son format. Sa présence et sa taille son validés via le back.
      if(this.selectedMonthPublicationModal) {
        // J'enlève le message d'erreur s'il est présent
        this.NoDatePublicationModal = false
        // J'enlève les border rouge des 2 input (s'ils sont présents)
        monthPicker.classList.remove("vue-monthly-picker-red")
        this.publicationImageValid = null
        // J'enregistre mon nouveau numéro en base
        axios.post('http://127.0.0.1:8000/api/bellitalia', {
          number: this.interestNumber[0],
          date: this.selectedMonthPublicationModal,
          image: this.publicationImageArray,
        })
        // Validation front ET back : si tout va bien des 2 côtés
        .then(() => {
          // Pour que le numéro créé s'affiche dans la liste déroulante du Multiselect :
          // J'ajoute la date de publication (qui est récupérée dans le custom-label)
          this.createdPublication = {
            number: this.interestNumber[0],
            publication: this.selectedMonthPublicationModal
          }
          // Et je l'ajoute au tableau qui sert de "réservoir" à la liste déroulante
          this.storedPublications.push(this.createdPublication)
          // Je le sélectionne dans l'input du Multiselect
          this.interestNumber = {"number": this.interestNumber[0], "publication": this.selectedMonthPublicationModal._d }
          // Je ferme la modale
          this.$bvModal.hide('addPublicationModal')
        })
        // Validation back : si problème avec validator API, erreur renvoyée
        .catch(error => {
          // Ce IF n'intercepte que les erreurs qui auraient réussi à duper le validator
          if (error) {
            // Dans ce cas, j'affiche le message par défaut et je mets la bordure rouge à l'input
            this.publicationImageError = true
            this.publicationImageValid = false
          }
          // Pour tous les messages d'erreur du validator
          // Pour chaque erreur remontée, j'ajoute la bordure rouge
          this.errors = error.response.data

          if(this.errors.date){
            monthPicker.classList.add("vue-monthly-picker-red")
            this.publicationImageError = false
          }
          if(this.errors.image) {
            this.publicationImageValid = false
            this.publicationImageError = false
          }
        })

        // Dans tous les cas, on empêche la fermeture de la modale par défaut
        // (ce qui permet d'afficher les messages d'erreur du validator sur la modale)
        bvModalEvt.preventDefault()

        // Validation front : si pas de date renseignée
      } else {
        // J'empêche la validation
        bvModalEvt.preventDefault()
        // J'affiche un message d'erreur
        this.NoDatePublicationModal = true
        // Je passe le border en rouge
        monthPicker.classList.add("vue-monthly-picker-red")
      }
    },
    // Validation modale ajout supplément
    handleOkSupplementModal(bvModalEvt){
      this.supplementImageValid = null
      axios.post('http://127.0.0.1:8000/api/supplement', {
        name: this.interestSupplement[0],
        publication: this.interestNumberSupplementModal,
        image: this.supplementImageArray,
      })
      .then(() => {
        // Pour que le numéro créé s'affiche dans la liste déroulante du Multiselect :
        // J'associe volontairement à bellitalia_id le numéro de publication (et non l'id)
        // C'est la seule manière de le faire apparaître dans la liste déroulante
        // En back, je dois ensuite récupérer l'id pour pouvoir enregistrer l'interest
        this.createdSupplement = {
          name: this.interestSupplement[0],
          bellitalia_id: this.interestNumberSupplementModal['number']
        }
        this.storedSupplements.push(this.createdSupplement)
        // Je le sélectionne dans l'input du Multiselect
        // Rappel : ici, le bellitalia_id n'est pas l'id mais le numéro de la publication
        this.interestSupplement = {"name": this.interestSupplement[0], "bellitalia_id": this.interestNumberSupplementModal['number']}
        // Je ferme la modale
        this.$bvModal.hide('addSupplementModal')
      })
      // Validation back : si problème avec validator API, erreur renvoyée
      .catch(error => {
        // Ce IF n'intercepte que les erreurs qui auraient réussi à duper le validator
        if (error) {
          // Dans ce cas, j'affiche le message par défaut et je mets la bordure rouge à l'input
          this.supplementImageError = true
          this.supplementImageValid = false
        }
        // Pour tous les messages d'erreur du validator
        // Pour chaque erreur remontée, j'ajoute la bordure rouge
        this.errors = error.response.data

        if(this.errors.image) {
          this.supplementImageValid = false
          this.supplementImageError = false
        }
      })
      // Dans tous les cas, on empêche la fermeture de la modale par défaut
      // (ce qui permet d'afficher les messages d'erreur du validator sur la modale)
      bvModalEvt.preventDefault()
    },
    // Si la validation back a échoué, le message d'erreur reste affiché dans la modale.
    // Cette méthode permet de l'effacer quand on clique sur Annuler
    handleCancelPublicationModal(){
      this.errors = {}
      this.interestNumber = []
      this.publicationImage = ''
      this.publicationImageError = false
      this.publicationImageValid = null
    },
    // Idem côté supplément
    handleCancelSupplementModal(){
      this.errors = {}
      this.interestSupplement = []
      this.supplementImage = ''
      this.supplementImageError = false
      this.supplementImageValid = null
    },
    // Pour tout changement dans le MonthPicker :
    monthSelectedPublicationModal(){
      var monthPicker = document.getElementById("month-picker")
      // J'enlève le message d'erreur s'il est présent
      this.NoDatePublicationModal = false
      // J'enlève le border rouge s'il est présent
      monthPicker.classList.remove("vue-monthly-picker-red");
    },
    // Méthodes gérant l'ajout et la suppression d'une image de couverture
    onPublicationFileChange(e) {
      // A chaque changement de l'input, j'enlève la bordure rouge si elle était présente
      this.publicationImageValid = null
      // J'enlève les messages d'erreur s'ils étaient présents
      this.errors.image = []
      this.error = false
      // Et je traite la nouvelle photo envoyée
      var files = e.target.files || e.dataTransfer.files;

      // Si aucune photo n'est chargée, je ne renvoie rien.
      if (!files.length) {
        return;
        // Sinon, pour chaque photo envoyée, j'appelle la méthode createPublicationImage
      } else {
        var i;
        for(i=0;i<files.length;i++) {
          this.createPublicationImage(files[i])
        }
      }
    },
    onSupplementFileChange(e) {
      // A chaque changement de l'input, j'enlève la bordure rouge si elle était présente
      this.supplementImageValid = null
      // J'enlève les messages d'erreur s'ils étaient présents
      this.errors.image = []
      this.error = false
      // Et je traite la nouvelle photo envoyée
      var files = e.target.files || e.dataTransfer.files;

      // Si aucune photo n'est chargée, je ne renvoie rien.
      if (!files.length) {
        return;
        // Sinon, pour chaque photo envoyée, j'appelle la méthode createPublicationImage
      } else {
        var i;
        for(i=0;i<files.length;i++) {
          this.createSupplementImage(files[i])
        }
      }
    },
    createPublicationImage(publicationFile) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.publicationImage = e.target.result;
        this.publicationImageArray.push(this.publicationImage);
      };
      reader.readAsDataURL(publicationFile);
    },
    createSupplementImage(supplementFile) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.supplementImage = e.target.result;
        this.supplementImageArray.push(this.supplementImage);
      };
      reader.readAsDataURL(supplementFile);
    },
    removePublicationImage: function (e) {
      this.publicationImage = '';
      this.publicationImageArray = [];
      this.publicationImageError = false
      this.errors = {};
      this.publicationImageValid = null;
      e.preventDefault();
    },
    removeSupplementImage: function (e) {
      this.supplementImage = '';
      this.supplementImageArray = [];
      this.supplementImageError = false
      this.errors = {};
      this.supplementImageValid = null;
      e.preventDefault();
    },
    // // Méthodes gérant l'ajout et la suppression des images du point d'intérêt
    onInterestFileChange(e) {
      // A chaque changement de l'input, j'enlève la bordure rouge si elle était présente
      // this.publicationImageValid = null
      // J'enlève le message d'erreur s'il était présent
      // this.errors.image = []
      // Et je traite la ou les nouvelles photos envoyées
      var files = e.target.files || e.dataTransfer.files;

      // Si aucune photo n'est chargée, je ne renvoie rien.
      if (!files.length) {
        return;
        // Sinon, pour chaque photo envoyée, j'appelle la méthode createInterestImage
      } else {
        var i;
        for(i=0;i<files.length;i++) {
          this.createInterestImage(files[i])
        }
      }
    },
    createInterestImage(interestFile) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.interestImage = e.target.result;
        // Je mets chacune des photos envoyées dans un tableau.
        // C'est ce tableau qui sert à l'affichage des photos.
        this.interestImageArray.push(this.interestImage);
      };
      reader.readAsDataURL(interestFile);
    },
    removeInterestImage: function (e) {
      this.interestImage = '';
      this.interestImageArray = [];
      this.interestImageError = false;
      e.preventDefault();
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
    // Ajout d'une nouvelle publication à la volée
    addPublication(newPublication) {
      // Si une image est déjà chargée, je l'enlève
      this.publicationImage = ""
      this.publicationImageArray =[]
      this.createdPublication = {
        number: newPublication,
      }
      // Le JS empêche la saisie de lettres, mais Multiselect en laisse passer malgré tout une.
      // Et comme, en plus, le multiselect ne renvoie que des strings :
      // On parseInt tout ce qui est envoyé par le Multiselect
      var parsedPublication = parseInt(this.createdPublication.number)
      // Pour une raison que j'ignore, je dois redire que interestNumber est un tableau, sinon bug à l'update.
      this.interestNumber = new Array()
      // On affiche ensuite la nouvelle publication dans l'input
      this.interestNumber.push(parsedPublication)
      // On enlève le message d'erreur s'il était présent
      // On réactive le bouton valider s'il avait été désactivé
      this.NotANumberPublicationModal = false;
      this.okDisabledPublicationModal = false;
      // Si jamais une lettre a réussi à se glisser jusqu'ici, on affiche un message d'erreur
      // Et on désactive le bouton valider
      if(isNaN(this.interestNumber[0])) {
        this.NotANumberPublicationModal = true;
        this.okDisabledPublicationModal = true;
      } else {
        // On remet tout à la normale si l'utilisateur saisit finalement un nombre valide
        this.NotANumberPublicationModal = false;
        this.okDisabledPublicationModal = false;
      }
      // Ouverture de la modale d'ajout d'un nouveau numéro
      this.$refs['addPublicationModal'].show()
    },
    // Ajout d'un supplément à la volée
    addSupplement(newSupplement) {
      // Si une image est déjà chargée, je l'enlève
      this.supplementImage = ""
      this.supplementImageArray =[]
      this.createdSupplement = {
        name: newSupplement,
      }
      // Pour une raison que j'ignore, je dois redire que interestSupplement est un tableau, sinon bug à l'update.
      this.interestSupplement = new Array()
      this.createdSupplement = {
        name: newSupplement,

      }
      // On affiche ensuite la nouvelle publication dans l'input
      this.interestSupplement.push(newSupplement)
      // Ouverture de la modale d'ajout d'un nouveau supplément
      this.$refs['addSupplementModal'].show()
    },
    // Récupération des publications BI en BDD
    getStoredPublications() {
      axios.get('http://127.0.0.1:8000/api/bellitalia')
      .then(response => (this.storedPublications = response.data))
    },
    // Récupération des régions en BDD
    getStoredRegions() {
      axios.get('http://127.0.0.1:8000/api/region')
      .then(response => (this.storedRegions = response.data))
    },
    // Récupération des suppléments en BDD
    getStoredSupplements() {
      axios.get('http://127.0.0.1:8000/api/supplement')
      .then(response => (this.storedSupplements = response.data))
    },
    // Enregistrement d'un nouveau point d'intérêt
    submitForm() {
      axios.post('http://127.0.0.1:8000/api/interest', {
        name: this.interestName,
        address: this.interestAddress,
        description: this.interestDescription,
        link: this.interestLink,
        latitude: this.interestLatitude,
        longitude: this.interestLongitude,
        bellitalia_id: this.interestNumber,
        supplement_id: this.interestSupplement,
        tag_id: this.interestTag,
        image: this.interestImageArray,
      })
      .then(() => {
        this.interestName = ""
        this.interestAddress = ""
        this.interestDescription = ""
        this.interestLink = ""
        this.interestLatitude = ""
        this.interestLongitude = ""
        this.interestNumber = ""
        this.interestSupplement = ""
        this.interestDate = ""
        this.interestTag = ""
        this.image = ""
        this.interestImageArray = []
        this.errors = {}
        this.interestImageError = false
        this.$router.push('/')
        this.flashMessage.show({
          status: 'success',
          title: 'Confirmation',
          message: 'Le point d\'intérêt a bien été enregistré'
        });
      })
      .catch(error => {

        // Ce IF n'intercepte que les erreurs qui auraient réussi à duper le validator
        if (error) {
          // Dans ce cas, j'affiche le message par défaut et je mets la bordure rouge à l'input
          console.log('error', error)
          this.interestImageError = true
        }

        this.errors = error.response.data
        if(this.errors.bellitalia_id) {
          this.publicationErrorClass= "multiselect__tags-red"
          this.publicationErrorTextClass= "text-error"
          this.interestImageError = false
        }
        if(this.errors.supplement_id) {
          this.supplementErrorClass= "multiselect__tags-red"
          this.supplementErrorTextClass= "text-error"
          this.interestImageError = false
        }
        if(this.errors.tag_id) {
          this.tagErrorClass= "multiselect__tags-red"
          this.tagErrorTextClass="text-error"
          this.interestImageError = false
        }
        if(this.errors.name) {
          this.nameErrorClass= "border-red"
          this.nameErrorTextClass="text-error"
          this.interestImageError = false
        }
        if(this.errors.address) {
          this.addressErrorClass= "border-red"
          this.addressErrorTextClass="text-error"
          this.interestImageError = false
        }
        if(this.errors.latitude) {
          this.latitudeErrorClass= "border-red"
          this.latitudeErrorTextClass="text-error"
          this.interestImageError = false
        }
        if(this.errors.longitude) {
          this.longitudeErrorClass= "border-red"
          this.longitudeErrorTextClass="text-error"
          this.interestImageError = false
        }
      })
    },
    // Modification d'un point d'intérêt
    // WIP : gérer correctement l'édit supplement vs publication 
    editForm() {
      axios.put('http://127.0.0.1:8000/api/interest/'+this.$route.params.id, {
        name: this.interestName,
        address: this.interestAddress,
        description: this.interestDescription,
        link: this.interestLink,
        latitude: this.interestLatitude,
        longitude: this.interestLongitude,
        bellitalia_id: this.interestNumber,
        tag_id: this.interestTag,
        image: this.interestImageArray,
      })
      .then(() => {
        this.interestName = ""
        this.interestAddress = ""
        this.interestDescription = ""
        this.interestLink = ""
        this.interestLatitude = ""
        this.interestLongitude = ""
        this.interestNumber = ""
        this.interestDate = ""
        this.interestTag = ""
        this.image = ""
        this.interestImageArray = []
        this.errors = {}
        this.$router.push('/')
        this.flashMessage.show({
          status: 'success',
          title: 'Confirmation',
          message: 'Le point d\'intérêt a bien été modifié'
        });
      })
      .catch(error => {
        this.errors = error.response.data
      })
    },
    // Récupération d'un point d'intérêt existant pour édit
    getInterest() {
      axios.get('http://127.0.0.1:8000/api/interest/'+this.$route.params.id)
      .then(r => {
        var image = ''
        for(image of r.data.data.images) {
          this.interestImageArray.push(image.url)
        }
        this.edit = true
        this.interest = r.data.data
        this.interestName = r.data.data.name
        this.interestAddress = r.data.data.address
        this.interestDescription = r.data.data.description
        this.interestLink = r.data.data.link
        this.interestLatitude = r.data.data.latitude
        this.interestLongitude = r.data.data.longitude
        this.interestNumber = {"number": r.data.data.bellitalia.number, "publication": r.data.data.bellitalia.publication}
        this.interestSupplement = {"name": r.data.data.bellitalia.supplements[0].name, "bellitalia_id": r.data.data.bellitalia.number}
        this.interestTag = this.interestTag.concat(r.data.data.tags)
      })
    },
  },
  computed: {
    // Les 2 computed suivantes gèrent le comportement des input d'ajout de publication/supplément. Si l'un est sélectionné, l'autre est disabled, l'étoile rouge disparaît et l'input est vidé.
    supplementInputDisabled:function(){
      if(this.selectedPublication == "publication") {
        this.supplementRadio = "mb-2 muted"
        this.supplementRedStar = 'noRedStar'
        this.interestSupplement = ''
        return true
      } else {
        this.supplementRadio = 'mb-2'
        this.supplementRedStar = 'redStar'
        this.interestNumber = ''
        return false
      }
    },
    publicationInputDisabled:function(){
      if(this.selectedPublication == "supplement") {
        this.publicationRadio = "mb-2 muted"
        this.publicationRedStar = 'noRedStar'
        this.interestNumber = ''
        return true
      } else {
        this.publicationRadio = 'mb-2'
        this.publicationRedStar = 'redStar'
        this.interestSupplement = ''
        return false
      }
    }
  },
  mounted: function(){
    this.getStoredRegions();
    this.getStoredTags();
    this.getStoredPublications();
    this.getInterest();
    this.getStoredSupplements();
    // A l'ouverture du formulaire, je récupère les infos passées en URL
    this.interestName = this.$route.query.name;
    this.interestAddress = this.$route.query.address;
    this.interestLongitude = this.$route.query.longitude;
    this.interestLatitude = this.$route.query.latitude;

    // Méthode JS empêchant de saisir autre chose que des chiffres dans le champ numéro de publication
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

      //On applique une méthode légèrement différente pour la latitude et la longitude (que des chiffres + points)
      setInputFilter(document.getElementById("latitude"), function(value) {
        return /^-?\d*[.]?\d*$/.test(value); })

        setInputFilter(document.getElementById("longitude"), function(value) {
          return /^-?\d*[.]?\d*$/.test(value); })
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
      .multiselect__tags-red {
        border: 1px solid red;
        border-radius: 5px;
      }
      .multiselect__tags-black {
        border: 1px solid black;
        border-radius: 5px;
      }
      .helpText {
        color: #ADADAD;
      }
      .redStar {
        color:red;
      }
      .noRedStar {
        display: none;
      }
      .imageTrash:hover{
        cursor: pointer;
      }
      .formTitle{
        font-size: 1.6em;
        display: flex;
        justify-content: center;
      }
      .vue-monthly-picker-red {
        border: 1px solid red;
      }
      .text-error-hidden {
        display: none;
      }
      .previewImage {
        max-width:30%;
        margin:auto;
        display: flex;
      }
      .previewImage:hover {
        cursor: zoom-in;
        z-index: 3;
      }
      .deleteImageIcon {
        margin: auto;
        display: flex;
        margin-top:2%;
      }
      .interestImageArrayClass {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .interestImageClass {
        margin:10px;
        height: max-content;
        width: 200px;
        z-index: 3;
      }
      .interestImageClass:hover {
        cursor: zoom-in;
      }
      .informationLogo {
        margin-left:5px;
      }
      </style>

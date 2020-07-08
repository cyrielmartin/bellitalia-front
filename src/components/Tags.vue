<template>
  <div class="container">
    <a href="/"><b-button type="button"><i class="fas fa-arrow-circle-left"></i> Retour</b-button></a>
    <div class="row justify-content-center">
      <div class="col-md-10">
        <span class="formTitle">Gérer les catégories</span>
        <div class="card-body">

          <!-- Input recherche -->
          <div class="col-xs-12">
            <div class="form-group tableFilterInput">
              <input type="text" class="form-control" v-model="tableFilterInput" placeholder="Rechercher">
            </div>
          </div>

          <!-- Tableau -->
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
          >

          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="modalEdit(row.item, row.index, $event.target)" class="mr-1" v-b-tooltip.hover.topleft="'Modifier'">
              <i class="far fa-edit"></i>
            </b-button>
            <b-button size="sm" @click="modalDelete(row.item, row.index, $event.target)" class="mr-1" v-b-tooltip.hover.topright="'Supprimer'" variant="danger">
              <i class="far fa-trash-alt"></i>
            </b-button>
          </template>

        </b-table>

        <!-- Modal de modification -->
        <b-modal
        :id="editModal.id"
        :title="editModal.title"
        @cancel="resetEditModal"
        @hide="resetEditModal"
        @ok="handleEditOk"
        >
        <!-- Input dans la modal -->
        <form ref="form" @submit.stop.prevent="handleEditSubmit">
          <b-form-group
          :state="nameState"
          label="Nom de la catégorie"
          label-for="name-input"
          invalid-feedback="Veuillez saisir un nom de catégorie"
          >
          <b-form-input
          id="name-input"
          v-model="tagName"
          :state="nameState"
          required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

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
          label:'Catégorie',
          sortable: true
        },
        {
          key: 'interests.length',
          label:'Points d\'intérêt associés',
        },
        {
          key: 'actions',
          label: 'Actions'
        },
      ],
      editModal: {
        id: 'edit-modal',
        title: '',
        content: ''
      },
      tagName: '',
      tagId: '',
      nameState: null,
      errors: {},
    }
  },
  mounted: function() {
    axios
    .get('http://127.0.0.1:8000/api/tag')
    .then(r => {
      this.tags = r.data.data
    })
  },
  methods:{
    // Méthode gérant l'ouverture de la modal de modification
    modalEdit(item, index, button) {
      this.editModal.title = 'Modifier la catégorie'
      // Pour remplir l'input avec le bon nom de catégorie
      this.tagName = item.name
      // Pour stocker le bon id de catégorie
      this.tagId = item.id
      // Ouverture modal
      this.$root.$emit('bv::show::modal', this.editModal.id, button)
    },
    // Après fermeture de la modale de modification, on enlève le message d'erreur et la bordure rouge (si présents)
    resetEditModal() {
      this.nameState = null
    },
    handleEditOk(bvModalEvt) {
      // A la validation de la modale de modificaton, j'empêche sa fermeture
      bvModalEvt.preventDefault()
      // J'appelle la méthode handleEditSubmit
      this.handleEditSubmit()
    },
    // Vérification validation modal modification
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      return valid
    },
    handleEditSubmit() {
      // Je vérifie la validité de l'input grâce à la méthode checkFormValidity.
      if (!this.checkFormValidity()) {
        return
        // Si ok, j'envoie la modification
      } else {
        axios.put('http://127.0.0.1:8000/api/tag/'+this.tagId, {
          name: this.tagName,
        })
        .then(() => {
          // Après envoi modification, je ferme la modale
          this.$bvModal.hide(this.editModal.id)
          // Et je remets les compteurs à zéro
          this.nameState = null
          this.tagName = ''
          this.errors = {}
          // Et je recharge le tableau pour que modif soit prise en compte sans devoir recharger toute la page
          // NB: je ne suis pas sûr que ce soit une bonne méthode, mais je ne vois pas comment faire autrement
          axios.get('http://127.0.0.1:8000/api/tag')
          .then(r => {
            this.tags = r.data.data
          })
          // J'affiche un message de réussite
          this.flashMessage.show({
            status: 'success',
            title: 'Confirmation',
            message: 'La catégorie a bien été modifiée'
          });
        })
        .catch(error => {
          console.log('error', error),
          this.errors = error.response.data
        })
      }
    },
    // Méthode gérant la suppression d'une catégorie
    modalDelete(item) {
      this.tagId = item.id
      // D'abord, une modale de confirmation
      this.$bvModal.msgBoxConfirm('Voulez-vous vraiment supprimer cette catégorie ?', {
        title: 'Confirmation',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Oui',
        cancelTitle: 'Non',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
      // Si ok, on supprime la catégorie
      .then(value => {
        axios.delete('http://127.0.0.1:8000/api/tag/'+this.tagId)
        // On recharge la liste des catégories sans recharger toute la page
        .then(() => {
          axios.get('http://127.0.0.1:8000/api/tag')
          .then(r => {
            this.tags = r.data.data
          })
            // Et on affiche un message de réussite
            this.flashMessage.show({
              status: 'success',
              title: 'Confirmation',
              message: 'La catégorie a bien été supprimée'
            });
        })
      })
      .catch(err => {
      })
    }
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

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
          >

          <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1" v-b-tooltip.hover.left="'Modifier'">
              <i class="far fa-edit"></i>
            </b-button>
          </template>

        </b-table>

        <b-modal
        :id="infoModal.id"
        :title="infoModal.title"
        @cancel="reserInfoModal"
        @hide="resetInfoModal"
        @ok="handleOk"
        >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
          :state="nameState"
          label="Nom de la catégorie"
          label-for="name-input"
          invalid-feedback="Name is required"
          >
          <b-form-input
          id="name-input"
          v-model="tagName"
          :state="nameState"
          required
          ></b-form-input>
        </b-form-group>
      </form>
      <pre>{{ infoModal.content }}</pre>
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
      infoModal: {
        id: 'info-modal',
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
    info(item, index, button) {
      this.infoModal.title = 'Modifier la catégorie'
      // this.infoModal.content = JSON.stringify(item.name, null, 2)
      this.tagName = item.name
      this.tagId = item.id
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      return valid
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      // this.submittedNames.push(this.name)
      axios.put('http://127.0.0.1:8000/api/tag/'+this.tagId, {
        tag_id: this.name,
      })
      .then(() => {
        console.log('then'),
        this.name = ''
        this.errors = {}
        this.$router.push('/categories')
        this.flashMessage.show({
          status: 'success',
          title: 'Confirmation',
          message: 'La catégorie a bien été modifiée'
        });
      })
      // .catch(error => {
      //   // console.log('error', error),
      //   // this.errors = error.response.data
      // })
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
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

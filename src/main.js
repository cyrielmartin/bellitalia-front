import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './scss/main.scss';
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import FlashMessage from '@smartweb/vue-flash-message'
import VModal from 'vue-js-modal'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueMonthlyPicker from 'vue-monthly-picker'
import Viewer from 'v-viewer'
import { TColumnsDefinition, VuejsDatatableFactory } from 'vuejs-datatable'

Vue.use(FlashMessage);
Vue.use( VuejsDatatableFactory );
VuejsDatatableFactory.useDefaultType( false )
    .registerTableType( 'datatable', tableType => tableType.mergeSettings( {
        table: {
            class:   'table table-hover table-striped',
            sorting: {
                sortAsc:  '<i class="fas fa-sort-amount-up" title="Sort ascending"></i>',
                sortDesc: '<i class="fas fa-sort-amount-down" title="Sort descending"></i>',
                sortNone: '<i class="fas fa-sort" title="Sort"></i>',
            },
        },
        pager: {
            classes: {
                pager:    'pagination text-center',
                selected: 'active',
            },
            icons: {
                next:     '<i class="fas fa-chevron-right" title="Next page"></i>',
                previous: '<i class="fas fa-chevron-left" title="Previous page"></i>',
            },
        },
    } ) );

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
Vue.use('axios')
const moment = require('moment')
require('moment/locale/fr')

Vue.use(require('vue-moment'), {
  moment
})
Vue.use(VModal, {dialog: true})
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Viewer)

// Chargement du router dans VueJS
Vue.use(VueRouter)


// Instanciation du router
const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    component: require('./components/Bellitalia.vue').default
  }, {
    path: '/add',
    name: 'add',
    component: require('./components/InterestForm.vue').default
  }, {
    path: '/interest/:id',
    component: require('./components/InterestForm.vue').default
  }, {
    path: '/interest/:id/edit',
    component: require('./components/InterestForm.vue').default
  }, {
    path: '/interest/:id/delete',
    component: require('./components/InterestMap.vue').default
  }, {
    path: '*',
    redirect: '/'
  }, {
    path: '/publications',
    component: require('./components/Publications.vue').default
  }, {
    path: '/categories',
    component: require('./components/Tags.vue').default
  }]
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')

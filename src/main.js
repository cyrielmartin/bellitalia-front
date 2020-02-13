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


Vue.use(FlashMessage);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
Vue.use('axios')
Vue.use(require('vue-moment'))
Vue.use(VModal, {dialog: true})
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)


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
  }]
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')

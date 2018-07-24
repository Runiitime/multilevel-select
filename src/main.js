import Vue from 'vue';
import _ from 'lodash';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import MultiLevelSelect from './components/multi-level-select.vue';


Vue.component('multi-level-select', MultiLevelSelect);
Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  render: h => h(App)
});

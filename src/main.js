import Vue from 'vue'
import App from './App.vue'

import OnVisible from 'vue-on-visible'

import env from './env/dev';

Vue.use(OnVisible)

Vue.config.productionTip = false
Vue.config.base = 'ui'
 

Vue.component('items', { 
  props:['data'],  
  template: `
    <h1> Items </h1>
    <ul>
        <li v-for="v in data">
            <OnVisible topOffset="-20%"
            bottomOffset="-20%"
            :repeat="true">
                <div class="box"
                        :style="{backgroundColor: '#e6e6e6'}"
                        slot-scope="{onVisible}">
                        <div v-for="(value, key) in onVisible"
                        :key="key">
                     <h4>{{key}}</h4>: <h5>{{value}}</h5>
                   </div>
                           
                     </div>
             </OnVisible>
        </li>
    </ul>
  `
});



var app = new Vue({
  render: h => h(App),
  data: { 
    data : []
  } 
}).$mount('#app')



function go(){ 



}

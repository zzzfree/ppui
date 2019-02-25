<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <Breadcrumb v-bind:path='path' @pathChanged='onPathChanged'/>
    <button v-on:click="go()">go</button>
    <button v-on:click="collect()">collect</button>
    <ul >
      
      <li class="imageItem"  v-for="v in data" v-on-visible="{onUpdate}"  >
        <div class="imageItem" v-bind:class="{selected:v.selected}">
          {{ v.path }}
          <div class="zoom">Z</div>
          <div class="select" v-on:click='remove(v)'>S</div>
                  <OnVisible topOffset="-20%"
                    bottomOffset="-20%"
                    :repeat="true">
                    <div slot-scope="{onVisible}">
                      <!-- <div v-for="(value, key) in onVisible"
                          :key="key">
                        <h4>{{key}}</h4>: <h5>{{value}}</h5>
                        
                      </div> -->
                      <img  v-if="onVisible.isVisible" v-bind:src="env.apiRoot + '/img/' + v.path " height="150px" max-width="150px" />
                    </div> 
                        
                  </OnVisible>

        </div>
      </li> 
    </ul>
     
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
//import Items from './components/Items.vue'
import _ from "lodash";

import env from './env/dev';

var app = {
  name: "app",
  components: {
    HelloWorld //, Items
    ,Breadcrumb
  },
  data: function() {
    return {
      data: [],
      env: env,
      path: 'aa/bb/cc/dd'
    };
  },
  methods: {
    onPathChanged(p){
      this.path = p;
    },
    collect(){
      _.each(this.data, v=>{
        if(v.selected){
          console.log(v.path); 
        }
      });
    },
    remove(v){
      v.selected = !v.selected;
      console.log(v);
    },
    onUpdate(item) {
      // console.log(item);
    },
    go() {
      var me = this;
      axios.get( env.apiRoot + "/users").then(function(rsp) {
        console.log(rsp.data);
        var d = [];
        var j = 0;
        for (var i = 0; i < 10; i++) {
          _.each(rsp.data, function(v) {
            if (++j > 600) return;
            d.push({
              isImage: v.indexOf(".") >= 0,
              path: v,
              selected: false
            });
          });
        }

        me.data = [];
        me.data = d;
      });
    }
  }
};

export default app;
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.imageItem{
  float: left;
  margin: 10px;
  list-style-type: none;
  min-width: 180px;
  min-height: 180px;
}

.selected{
  background: red;
}
</style>

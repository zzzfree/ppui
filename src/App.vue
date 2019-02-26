<template>
  <div id="app" >
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <div>Current path: {{ path }} </div>

    <Breadcrumb v-bind:path='path' @pathChanged='onPathChanged'/>
    <DirList v-bind:files="data" v-bind:path='path' @selected='onDirSelected' />

    <button v-on:click="go()">go</button>
    <button @click="unselectAll()">unselectAll</button> 
    <button v-on:click="collect()">collect</button>
    <ul >
      
      <li class="imageItem"  v-for="v in imgs" v-on-visible="{onUpdate}"  >
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
import DirList from "./components/DirList.vue";
//import Items from './components/Items.vue'
import _ from "lodash";

import env from './env/dev'; 

var app = {
  name: "app",
  components: {
    HelloWorld //, Items
    ,Breadcrumb,DirList
  },
  computed:{
    path: function(){
      return this.path;
    },
    imgs: function(){
      var dd = _.filter(this.data, v=>{
        return v.path && /(jpg)$/.test( v.path.toLowerCase() ) 
      });
      return dd;
    }
  },
  data: function() {
    return {
      data: [],
      env: env,
      path: '---'
    };
  },
  mounted(){
    console.log('mounted now.');
    this.go();
  },
  methods: {
    unselectAll(){
      _.each(this.data, v =>{
        v.selected = false;
      });
    },
    onDirSelected(p){
      console.log('dirchanged: '+p);
      this.path = p;
      this.go();
    },
    onPathChanged(p){
      this.path = p; 
      this.go();
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
      axios.get( env.apiRoot + "/files/" + this.path ).then(function(rsp) {
        console.log(rsp.data);
        var d = [];
        var j = 0;
        for (var i = 0; i < 1; i++) {
          _.each(rsp.data, function(v) {
            if (++j > 600) return;
            d.push({
              isImage: v.indexOf(".") >= 0,
              path: v,
              selected: false,
              deleted: false
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

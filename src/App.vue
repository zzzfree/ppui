<template>
  <div id="app" >
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <div>Current path: {{ currentPath }} </div>

    <Breadcrumb v-bind:path='path' @pathChanged='onPathChanged'/>
    <DirList v-bind:files="data" v-bind:path='path' @selected='onDirSelected' />

    <button v-on:click="go()">go</button>
    <button class='toclear' @click="unselectAll()"><i class="icon-check-empty"></i> Clear </button> 
    <button class='toremove' v-on:click="collect()"><i class="icon-trash"></i> Remove </button>

    <div class='picZoom' v-if='isShowZoom' @click='closeZoom()'>
      <img v-bind:src="env.apiRoot + '/img/' + path + '---' + currentZoomPath  " />
    </div>

    <div class="totop"> <a href='#app'> <i class="icon-double-angle-up icon-large"></i>  </a>  </div>
    
    <ul >
      
      <li class="imageItem"  v-for="(v,i) in imgs" v-on-visible="{onUpdate}" v-if='v.deleted==false' >
        <div  v-bind:class="{selected:v.selected}" >
          
          <div class="zoom" v-on:click='zoom(v)'> <i class="icon-search icon-large"></i>    </div>
          <div class="select" v-on:click='remove(v)'> <i class="icon-check icon-large"></i> </div>
          <div class="download" v-on:click='download(v)'> <i class="icon-download-alt icon-large"></i> </div>

          <div v-if=" i<20 ">

            <img   v-bind:src="env.apiRoot + '/img/' + path + '---' + v.path" height="150px" max-width="150px" />
 
          </div>
         

          <OnVisible v-if="i>20" topOffset="-20%"
            bottomOffset="-20%"
            :repeat="true">
            <div slot-scope="{onVisible}">
              <!-- <div v-for="(value, key) in onVisible"
                  :key="key">
                <h4>{{key}}</h4>: <h5>{{value}}</h5>
                
              </div> -->
              <img  v-if="onVisible.isVisible && i>20" v-bind:src="env.apiRoot + '/img/' + path + '---' + v.path" height="150px" max-width="150px" />
              
            </div> 
                
          </OnVisible>
          <label> {{ v.path }}  </label>
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

const crypto = require('crypto');

function md5(s){
  const hash = crypto.createHash('md5');
  hash.update(s);
  return hash.digest('hex');
}

var app = {
  name: "app",
  components: {
    HelloWorld //, Items
    ,Breadcrumb,DirList
  },
  computed:{
    // path: function(){
    //   return this.path;
    // },
    currentPath: function(){
      return this.path.replace(/\-{3}/ig, '/');
    },
    currentZoomPath: function(){
      return this.zoomPath;
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
      path: '---',
      zoomPath: '',
      isShowZoom: false
    };
  },
  mounted(){
    console.log('mounted now.');
    this.go();
  },
  methods: {
    zoom(v){
      this.zoomPath = v.path + '?width=' + window.innerWidth;
      this.isShowZoom = true;
    },
    download(v){
      var p = env.apiRoot + '/img/' + this.path + '---' + v.path + '?width=full';
      window.open(p); 
    },
    closeZoom(){
      this.isShowZoom = false;
    },
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

      if(!confirm('Confirm to remove?')) return;

      var p = this.path.replace(/\-{3}/ig, '/');
      var dd = [];
      _.each(this.data, v=>{
        if(v.selected && !v.deleted){
          var d = p + '/' + v.path;
          dd.push( d )
        }
      });
        
      console.log( dd ); 
      var me = this; 

      var p = me.path.replace(/\-{3}/ig,'/') + '/';

      axios.post( env.apiRoot + "/files/remove" , { files: dd } ).then(rsp=>{
        console.log( rsp.data );
        if(rsp.data && rsp.data.length>0){
          _.each(rsp.data, v=>{
            var f = _.find(me.data, {path:v.path.replace(p,'')});
            if(f && f.path){  
              f.deleted = v.success; 
            }
          });
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

      console.log(md5('ABC'));
 

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
  margin: 1px;
  list-style-type: none;
  min-width: 250px;
  min-height: 250px;
  max-width:30%;
  border: 1px solid #ccc;
    position: relative;
}

.selected{
  background: #999;
  opacity: 0.5;
}

.zoom{
  float: left;
  margin-left: 20px;  
}

.select{
  float: right;
  margin-right: 20px;
}
.totop{
  position: fixed;
  right: 20px;
  bottom: 10px;
}
.toclear{
  position: fixed;
  left: 20px;
  top: 10px; 
}
.toremove{
  position: fixed;
  left: 20px;
  top: 50px; 
}
.download{
  position: absolute;
  bottom: 20px;
    left: 20px;
}
.picZoom{
  position: fixed;
    width: 95%;
    z-index: 10000;
    top: 10px;
}
</style>

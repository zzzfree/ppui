<!-- icons example http://caibaojian.com/fontawesome/cheatsheet.html -->

<template>
  <div id="app" >
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <div>{{ deviceInfo }} </div>
    <div>Current path: {{ currentPath }} </div>

    <Breadcrumb v-bind:path='path' @pathChanged='onPathChanged'/>
    <DirList v-bind:files="data" v-bind:path='path' @selected='onDirSelected' />

    <!-- <button v-on:click="go()">go</button> -->
    <button class='toclear' @click="unselectAll()"><i class="icon-check-empty"></i> Clear </button> 
    <button class='toremove' v-on:click="collect()"><i class="icon-trash"></i> Remove </button>

    <div class='picZoom' v-if='isShowZoom' @click='closeZoom()'> 
      <label> {{ path }}  </label>
      <img v-bind:src="env.apiRoot + '/img/' + path + '---' + currentZoomPath  " />
    </div>

    <div class="totop"> <a href='#app'> <i class="icon-double-angle-up icon-large"></i>  </a>  </div>
    <div class="back" v-on:click='back()'>  <i class=" icon-arrow-left icon-largewq" aria-hidden="true"></i>   </div>
    
    <ul class='listItems'>
      
      <li class="imageItem"  v-for="(v,i) in imgs" v-on-visible="{onUpdate}" v-if='v.deleted==false' >
        <div  v-bind:class="{selected:v.selected}" v-bind:title="v.path" >
          
          <div class="zoom" v-on:click='zoom(v)'> <i class="icon-search icon-large"></i>    </div>
          <div class="select" v-on:click='remove(v)'> <i class="icon-check icon-large"></i> </div>
          <div class="download" v-on:click='download(v)'> <i class="icon-download-alt icon-large"></i> </div>

          <div class='imgContainer' v-if=" i<20 || i>imgs.length-10"   :style="{width: itemWidth +'px', height: itemWidth + 'px'}"  >

            <!-- <img v-on:click='zoom(v)'  v-bind:src="env.apiRoot + '/img/' + path + '---' + v.path" height="150px" max-width="150px" /> -->
            <img v-on:click='zoom(v)'  v-bind:src=" thumborPath + v.path " height="150px" max-width="150px" />
 
          </div>
   
          <div class='imgContainer' v-if=" i>=20 && i<=imgs.length-10" :style="{width: itemWidth +'px', height: itemWidth + 'px'}"  >


            <OnVisible  topOffset="-20%"
              bottomOffset="-20%"  
              :repeat="true">
              <div  slot-scope="{onVisible}">
                <!-- <div v-for="(value, key) in onVisible"
                    :key="key">
                  <h4>{{key}}</h4>: <h5>{{value}}</h5>
                  
                </div> -->
                <!-- <img v-on:click='zoom(v)' v-if="onVisible.isVisible && i>=20" v-bind:src="env.apiRoot + '/img/' + path + '---' + v.path" height="150px" max-width="150px" /> -->
                <span v-if="onVisible.isVisible && i>=20" >
                <img v-on:click='zoom(v)'  v-bind:src=" thumborPath + v.path " height="150px" max-width="150px" />
                </span>
              </div> 
                  
            </OnVisible>
 
          </div> 
          
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
    deviceInfo: function(){
      return "deviceInfo: " + screen.availWidth + ',' + window.innerWidth;
    },
    currentPath: function(){
      return this.path.replace(/\-{3}/ig, '/');
    },
    currentZoomPath: function(){
      return this.zoomPath;
    },
    thumborPath: function(v){
      var p = 'http://192.168.10.104:8080/unsafe/200x200/http://192.168.10.104:30080/static/';
      //p += this.currentPath.replace('/d2t/','');
      p += this.currentPath;
      p += '/';
      //p += v.path;
      return p;
    },
    imgs: function(){
      var dd = _.filter(this.data, v=>{
        return v.path && /(jpg|jpeg)$/.test( v.path.toLowerCase() ) 
      }); 
      return dd;
    }
  },
  data: function() {
    return {
      data: [],
      itemWidth: screen.availWidth/3.1,
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
    back(){
      // ---d2t
      if(this.path==='---') return;
      var pos = this.path.lastIndexOf("---");
      if(pos>0){
        this.path = this.path.substring(0, pos);
      } else {
        this.path = '---';
      }  
      console.log('dirchanged: '+ this.path);
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
        document.body.scrollTop = 0;
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

.listItems{
  margin: 5% 1px;
}

.imageItem{
  float: left;
  margin: 1px;
  min-height: 115px;
  list-style-type: none;
  /* min-width: 250px; */
  /* min-height: 250px; */
  max-width:32%;
  border: 1px solid #ccc;
  position: relative;
}

.imgContainer{
  /* width: 100px;
  height: 100px; */
  overflow: hidden;
  display: block; 
}

.imageItem img{
  width: 98%;
  height: auto;
  vertical-align: middle;
}

.selected{
  background: #999;
  opacity: 0.5;
}

.zoom{
  float: left;
  margin-left: 10%;  
  position: absolute;
}

.select{
  position: absolute;
  float: right;
  margin-right: 10%;
  right: 0%;
}


.download{
  position: absolute;
  bottom: 20px;
    left: 10%;
}

.totop{
  position: fixed;
  right: 20px;
  bottom: 10px;
  z-index: 10;
}
.back{
  position: fixed;
  right: 60px;
  bottom: 10px;
  z-index: 10;
}
.toclear{
  position: fixed;
  left: 20px;
  top: 10px; 
  z-index: 10;
}
.toremove{
  position: fixed;
  left: 20px;
  top: 50px; 
  z-index: 10;
}
.picZoom{
  background-color: white;
  padding: 5% 0%;
  position: fixed;
    width: 95%;
    z-index: 10000;
    top: 10px;
}

.imageItem label {
    overflow: hidden;
    height: 12px;
    display: block;
    font-size: 12px;
    margin-bottom: 5px;
}



</style>

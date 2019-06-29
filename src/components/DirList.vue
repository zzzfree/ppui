<template> 
    <ul>
        <li v-for="(v,i) in data">
           <label v-bind:path="v.path" @click='go(v)'>
               {{ v.path }}
           </label>
        </li>
    </ul>
</template>

<script>

import _ from 'lodash';

export default {
    props:{
        path: String,
        files: Array
    },
    computed:{
        data: function(){
            var dd = _.filter(this.files, v=>{
                return /\.[a-zA-Z]{3,4}$/i.test(  v.path  ) == false // .indexOf('.') < 0;
            });
            return dd;
        }
    },
    methods:{
        go(v,i){ 
            console.log('selected ' + v.path); 
            var p =    this.path + (  this.path == '---' ? '' : '---'  )     + v.path   
            this.$emit('selected', p ); 
        }
    }
}
</script> 

<style scoped>
    li {
        list-style: none;  
        text-align: left; 
        padding: 5px 10px;
    }
    li label{ 
        text-align: left;
        cursor: pointer;
        padding: 5px 10px;
    }
    li label:hover{
        color:blue;
    }
    ul{
        clear: both;   
        visibility: visible;
        display: block;
    }
</style>

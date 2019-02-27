<template> 
    <ul>
        <li v-for="(v,i) in data"> 
           <div v-if='i==0' v-on:click='go(v,i)'> /Root </div>
           <div v-if='i>0' v-on:click='go(v,i)'> /{{ v }} </div>
        </li>
    </ul>
</template>

<script>
export default {
    props:{
        path: String 
    },
    computed:{
        data: function(){
            return this.path.split('---');
        }
    },
    methods:{
        go(v,i){
            i++;
            console.log(i + ',' + v);
            var d = this.path.split('---');
            var s = '';
            for(var n = 0; n<i; n++){
                s += d[n] + '---'
            }
            // this.path = s.substring(0,s.length-1);
            var p = s.replace(/\-{3}/ig,'/');
            p = p.substring(0, p.length-1).replace(/\//ig,'---'); 
            if(p == '') p = '---';
            this.$emit('pathChanged', p);

        }
    }
}
</script>

<style scoped>
    li{
        list-style: none;
        float: left;
        display: inline;
        cursor: pointer;
        padding: 5px 10px;
    }
    li:hover{
        color:blue;
    }
    ul{
        clear: both;   
        visibility: visible;
        display: block;
    }
</style>

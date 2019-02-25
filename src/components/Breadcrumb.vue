<template> 
    <ul>
        <li v-for="(v,i) in data">
           <div v-on:click='go(v,i)'> {{ i }} - {{ v }} </div>
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
            return this.path.split('/');
        }
    },
    methods:{
        go(v,i){
            i++;
            console.log(i + ',' + v);
            var d = this.path.split('/');
            var s = '';
            for(var n = 0; n<i; n++){
                s += d[n] + '/'
            }
            // this.path = s.substring(0,s.length-1);
            var p = s.substring(0,s.length-1);
            this.$emit('pathChanged', p);
        }
    }
}
</script>

<style scoped>

</style>

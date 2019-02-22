<template>
<div >
    <h1> Items </h1>
    <ul>
         <li v-for="v in data">
             
         </li>
    </ul>    
</div>

</template>


<script>
export default {
  name: 'Items',
  props: {
    data: []
  }
}
</script>
<template>
  <div id="app">
    <div>
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  
  }
}
</script>

<style>
</style>

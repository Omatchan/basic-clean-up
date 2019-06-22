<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="mgr-10">ベーシック 関西事業所</span>
        <span class="font-weight-light">掃除当番表</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title class="headline">
        <router-link to="/">Home</router-link>|
        <router-link to="/list">List</router-link>|
        <router-link to="/about">About</router-link>
      </v-toolbar-title>
      <v-spacer />
      <router-link to="/about">About</router-link>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
</script>

<style>
.mgr-10 {
  margin-right: 10px;
}
</style>

<template>
    <v-app-bar app>
      <v-container class="d-flex justify-space-between align-center">
        <v-toolbar-title class="display-1 text-uppercase">{{ pageTitle }}</v-toolbar-title>
        <v-btn small v-if="isAuthenticated" @click="logOutFunc()">
          <v-icon left small>mdi-logout</v-icon>
          LogOut
        </v-btn>
      </v-container>
    </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "Navbar",
    computed:{
      ...mapGetters(['isAuthenticated']),
      pageTitle(){
        if(this.$route.path.startsWith("/movie-page")){
          return "Movie Page"
        }else if(this.$route.path === "/"){
          return "Movies"
        }else{
          return this.$route.path.slice(1)
        }
      }
    },
    methods:{
      ...mapActions(['logOut']),
      async logOutFunc(){
        await this.logOut()
        this.$router.push('/login')
      }
    },
}
</script>

<style>

</style>
<template>
  <v-container>
    <v-form ref="regForm" v-model="valid" @submit.prevent="submitForm()">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-text-field
            v-model="registerForm.name"
            :rules="rules.name"
            label="Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-text-field
            v-model="registerForm.email"
            :rules="rules.email"
            label="Email"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-text-field
            v-model="registerForm.password"
            :rules="rules.password"
            type="password"
            label="Password"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn dark type="submit">submit</v-btn>
        </v-col>
        <p class="subtitle-1 text-center mx-auto mt-3 font-weight-bold">
          If you have account, <router-link to="/logIn">LogIn</router-link> Now.
        </p>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Home",
  data(){
    return {
      registerForm: {
        email: '',
        password: '',
        name: '',
      },
      valid: false,
      rules:{
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        name: [
          v => !!v || 'Name is required',
        ],
        password:[
          v => !!v || 'Password is Required',
          v => v.length >= 8 || 'Password Must be At least 8 Numbers'
        ]
      }
    }
  },
  methods:{
    ...mapActions(["Register"]),
    async submitForm(){
      if(this.$refs.regForm.validate()){
        try {
          await this.Register(this.registerForm);
          this.$router.push("/");
        } catch (error) {
          alert("Not Valid Form")
        }
      }else{
        alert('Please, Fill all Fields according to the rules')
      }
    }
  }
};
</script>

<style>
.v-text-field{
  max-width: 400px !important;
}
</style>

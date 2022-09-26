<template>
    <div class="movie-page">
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-img max-height="80vh" src="../assets/poster.jpg"></v-img>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card class="pa-5" color="#EEE">
                        <div class="content">
                            <v-card-title class="pa-0 mt-3">{{ movie.name }}</v-card-title>
                            <div class="d-flex align-center">
                                <span>Description: </span><v-card-text class="pa-2">{{ movie.description }}</v-card-text>
                            </div>
                            <div class="d-flex align-center">
                                <span>Category: </span><v-card-text class="pa-2">{{ getCategoryById(movie.category_id) }}</v-card-text>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
    
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
    name: "MoviePage",
    data(){
        return {
            movie : {},
            categories: this.getCategories,
        }
    },
    computed:{
        ...mapGetters(['getCategories']),
    },
    methods:{
        getCategoryById(id){
            let category = this.categories.filter(category => category.id == id)[0];
            if(category){
                return category.name;  
            }else{
                return "New Category";
            }
        },
    },
    async mounted(){
        const res = await axios({
            url: `movies/${this.$route.params.id}`,
            method: "get",
            'headers':{
                'Authorization': `Bearer ${localStorage.getItem('moviesRegisterToken')}`
            }
        })
        this.movie = res.data.message;
    },
    created(){
        this.categories = this.getCategories;
    }
}
</script>

<style>

</style>
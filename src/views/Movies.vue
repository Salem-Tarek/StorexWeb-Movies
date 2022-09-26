<template>
    <div class="movies">
        <v-container>
            <div class="add-movie">
                <div class="d-flex align-center justify-space-between">
                    <v-select
                        v-model="filteredCategory"
                        :items="searchCategories"
                        :rules="Rules.category"
                        cache-items
                        outlined
                        label="Select Category"
                        dense
                        hide-details=""
                        item-text="name"
                        item-value="id"
                        @change="filterCategory()"
                    ></v-select>
                    <v-btn depressed @click="createNewMovie()" class="my-5 ml-4" dark>
                        <v-icon left>mdi-plus</v-icon>
                        Add Movie
                    </v-btn>
                </div>

                <v-overlay :value="show" opacity="0.9">
                    <v-form
                    enctype="multipart/form-data"
                    ref="addForm"
                    v-model="valid"
                    lazy-validation
                    class="mx-auto py-5"
                    @submit.prevent="Add_Edit_Movie($event)"
                    >
                        <v-row>
                            <v-col cols="12" class="py-0">
                                <v-text-field
                                v-model="movieData.name"
                                :rules="Rules.name"
                                placeholder="Movie Name"
                                label="Movie Name"
                                required
                                outlined
                                dark
                                dense
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-textarea
                                v-model="movieData.description"
                                :rules="Rules.description"
                                placeholder="Movie Description"
                                label="Movie Description"
                                required
                                outlined
                                dark
                                dense
                                height="100px"
                                no-resize
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-select
                                v-model="movieData.category_id"
                                :items="categories"
                                :rules="Rules.category"
                                cache-items
                                outlined
                                label="Select Category"
                                dark
                                dense
                                item-text="name"
                                item-value="id"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" class="py-0">
                                <v-file-input
                                    v-model="movieData.image"
                                    accept=".jpg, .jpeg, .png"
                                    label="Upload Movie Image"
                                    outlined
                                    dark
                                    dense
                                    append-icon="mdi-image"
                                    prepend-icon=""
                                ></v-file-input>
                            </v-col>
                        </v-row>
                        <div class="mt-4">
                            <v-btn light :disabled="!valid" type="submit" class="mr-3"> {{ newMovie ? "Add Movie" : "Edit Movie" }}</v-btn>
                            <v-btn light @click="show = false">Cancel</v-btn>
                        </div>
                    </v-form>
                </v-overlay>
            </div>
            <v-row>
                <v-col cols="12" md="3" sm="6" v-for="movie in movies" :key="movie.id" class="d-flex align-center justify-center">
                    <router-link :to="'/movie-page/' + movie.id" class="text-decoration-none">
                        <v-card class="pa-5 pb-0" color="#EEE" height="515px" width="275px">
                            <v-img width="100%" height="300px" src="../assets/poster.jpg"></v-img>
                            <v-card-title class="pa-0 mt-3">{{ movie.name }}</v-card-title>
                            <div class="d-flex align-center">
                                <span>Description: </span><v-card-text class="pa-2">{{ movie.description }}</v-card-text>
                            </div>
                            <div class="d-flex align-center">
                                <span>Category: </span><v-card-text class="pa-2">{{ getCategoryById(movie.category_id) }}</v-card-text>
                            </div>
                            <v-card-actions class="d-flex align-center justify-space-between">
                                <v-icon @click.prevent="editMovie(movie)">mdi-pencil</v-icon>
                                <v-icon @click.prevent="deleteMovie(movie)">mdi-delete</v-icon>
                            </v-card-actions>
                        </v-card>
                    </router-link>
                </v-col>
                <v-col cols="12" class="text-center mt-10" v-if="movies.length === 0">
                    <p class="display-1">
                        No Movies found for this Category
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: "Movies",
    data(){
        return {
            show: false,
            valid: false,
            filteredCategory: "",
            newMovie: true,
            movies: [],
            movieData:{
                id: "",
                name: "",
                description: "",
                category_id: null,
                image: []
            },
            image: [],
            Rules: {
                name: [
                    v => !!v || "Movie name is Required",
                ], 
                description: [
                    v => !!v || "Description is Required",
                ],
                category: [
                    v => v !== "Select Category" || "Select Category",
                ],
            },
            searchCategories: this.getCategories,
            categories: this.getCategories,
        }
    },
    computed:{
        ...mapGetters(['getMovies', 'getCategories']),
    },
    methods:{
        ...mapActions(['AddMovie', 'EditMovie', 'DeleteMovie']),
        editMovie(movie){
            this.newMovie = false;
            this.show = true;
            this.movieData.id = movie.id;
            this.movieData.name = movie.name;
            this.movieData.description = movie.description;
            this.movieData.category_id = movie.category_id;
        },
        deleteMovie(movie){
            this.DeleteMovie(movie);
        },
        Add_Edit_Movie(e){
            if(this.$refs.addForm.validate()){
                console.log("Validated");
                if(e.submitter.innerText.toLowerCase().trim() === "add movie"){
                    this.AddMovie(this.movieData);
                }else if(e.submitter.innerText.toLowerCase().trim() === "edit movie"){
                    const movieData = {};
                    movieData.id =  this.movieData.id;
                    movieData.image =  this.movieData.image;
                    movieData.name =  this.movieData.name;
                    movieData.description =  this.movieData.description;
                    movieData.category_id =  this.movieData.category_id;
                    this.EditMovie(movieData)
                }
                this.emptyFields()
                this.show = false;
            }else{
                alert('Please, Fill all Fields according to the rules')
            }
        },
        getCategoryById(id){
            let category = this.categories.filter(category => category.id == id)[0];
            if(category){
                return category.name;  
            }else{
                return "New Category";
            }
        },
        filterCategory(){
            if(this.filteredCategory === ""){
                this.movies = this.getMovies;
            }else{
                this.movies = this.getMovies.filter(movie => movie.category_id == this.filteredCategory);
            }
        },
        createNewMovie(){
            this.show = true;
            this.newMovie = true;
        },
        emptyFields(){
            this.movieData.id = "";
            this.movieData.image = [];
            this.movieData.name = "";
            this.movieData.description = "";
            this.movieData.category_id = "";
        }
    },
    watch:{
        getMovies(newVal){
            this.movies = newVal;
        }
    },
    created(){
        this.movies = this.getMovies;
        this.searchCategories = this.getCategories;
        this.searchCategories.unshift({name: "All Movies", id: ""});
        this.searchCategories = [...new Set(this.searchCategories)]
        this.categories = this.getCategories.filter(category => category.name !== "All Movies");
    }

}
</script>

<style>
.v-overlay .v-input {
    min-width: 100% !important;
}

.v-select__selections input{
    cursor: pointer !important;
}

.v-card__actions .v-icon {
    transition: 0.4s;
}
.v-card__actions .v-icon:hover {
    color: #000;
}
</style>
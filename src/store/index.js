import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('moviesRegisterToken') || null,
    movies: null,
    categories: []
  },
  getters:{
    getUser: state => state.user,
    getMovies: state => state.movies,
    getCategories: state => state.categories,
    isAuthenticated: state => !!state.user,
  },
  mutations: {
    setUser(state, token){
      state.user = token
    },
    setMovies(state, movies){
      state.movies = movies;
    },
    setCategories(state, categories){
      state.categories = categories;
    },
    addMovie(state, movie){
      state.movies.unshift(movie)
    },
    editMovie(state, editedMovie){
      let movieIndex = state.movies.findIndex(movie => movie.id == editedMovie.id);
      state.movies.splice(movieIndex, 1, editedMovie)
    },
    deleteMovie(state, deletedMovie){
      state.movies = state.movies.filter(movie => movie.id !== deletedMovie.id)
    },
    logOut(state){
      state.user = null;
      state.movies = null;
    },
  },
  actions: {
    async Register({dispatch}, form){
      const res = await axios.post('register', form)
      const theToken = res.data.authorisation.token;
      localStorage.setItem('moviesRegisterToken', theToken)
      if(res.status === 200){
        await dispatch('LogIn', form)
      }else{
        alert("This Email already Exist")
      }
    },
    async LogIn(context, user) {
      const res = await axios.post('login', user);
      if(res.status === 200){
        await context.commit('setUser', localStorage.getItem('moviesRegisterToken'))
      }else{
        alert("Email or Password incorrect")
      }

      localStorage.setItem('moviesRegisterToken', res.data.authorisation.token)

      context.dispatch('Movies', localStorage.getItem('moviesRegisterToken'))
      context.dispatch('Categories', localStorage.getItem('moviesRegisterToken'))
      
    },
    async Movies({commit}, token){
      const res = await axios.get('movies', {
        'headers':{
          'Authorization': `Bearer ${token}`
        }
      })
      commit('setMovies', res.data.message)
    },
    async Categories({commit}, token){
      const res = await axios.get('category', {
        'headers':{
          'Authorization': `Bearer ${token}`
        }
      })
      commit('setCategories', res.data.message)
    },
    async AddMovie({commit}, movie) {
      let data = new FormData;
      data.append('image', movie.image);
      data.append('name', movie.name);
      data.append('description', movie.description);
      data.append('category_id', movie.category_id);

      const response = await axios({
        url: 'movies',
        method: 'post',
        data: data,
        'headers':{
          'Authorization': `Bearer ${localStorage.getItem('moviesRegisterToken')}`
        }
      });
      commit('addMovie', response.data.message)
    },
    async EditMovie({commit}, updatedMovie){
      let data = new FormData;
      data.append('image', updatedMovie.image);
      data.append('name', updatedMovie.name);
      data.append('description', updatedMovie.description);
      data.append('category_id', updatedMovie.category_id);
      data.append('_method', "put");

      const response = await axios({
        url: `movies/${updatedMovie.id}`,
        method: 'post',
        data: data,
        'headers':{
          'Authorization': `Bearer ${localStorage.getItem('moviesRegisterToken')}`
        }
      });
      commit("editMovie", response.data.message)
    },
    async DeleteMovie({commit}, deletedMovie){
      let data = new FormData;
      data.append('image', deletedMovie.image);
      data.append('name', deletedMovie.name);
      data.append('description', deletedMovie.description);
      data.append('category_id', deletedMovie.category_id);
      data.append('_method', "delete");

      await axios({
        url: `movies/${deletedMovie.id}`,
        method: 'post',
        data: data,
        'headers':{
          'Authorization': `Bearer ${localStorage.getItem('moviesRegisterToken')}`
        }
      });
      commit("deleteMovie", deletedMovie)
    },
    logOut({commit}){
      localStorage.removeItem('moviesRegisterToken');
      commit('logOut')
    },
  },
  plugins: [createPersistedState()]
});

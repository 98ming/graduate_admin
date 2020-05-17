import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    app:{
      sidebar: {
        opened: true,
        withoutAnimation: true
      },
      device: 'desktop'
    },
    permission:{
      router:router.options.routes
    },
    admin:{}
  },
  mutations:{
    setOpened(state,data){
      state.app.sidebar.opened = !state.app.sidebar.opened;
    }
  },
  getters:{

  }
});

export default store;

import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import common from './modules/common' //  公共模块
import fileList from './modules/fileList' //  公共模块
import sideMenu from './modules/sideMenu' //  公共模块

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    webSocketMsg:''
},
mutations:{
  SET_WS_MSG: (state, msg) =>{
      state.webSocketMsg = msg
  }
},
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    common,
    fileList,
    sideMenu
  },
  getters
})

export default store

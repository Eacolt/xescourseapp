import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const {postAnswer, AnswerInfo} = require('../tophp');


const state = {
  postArr: [],//答题情况
  goldnum: 0,
  assetAllComplete:false,
  isPost: false,//是否已经提交答案
  gameConfig:null
};
const getters = {};
const actions = {
  SET_GAMECONFIG({commit},payload){
    commit('setGameConfig',payload);
  },
  SET_GAMECOMPLETE({commit},payload){
    commit('setAssetsCompleted',payload);

  },
  postAnswer({state}) {
    postAnswer(state.postArr, AnswerInfo.testNum);
    state.isPost = true;
  },
  pushToPostArr({state}, value) {
    state.postArr.push(value);
  }
};
const mutations = {
  setGameConfig(state,payload){
    state.gameConfig = payload;
  },
  setAssetsCompleted(state,payload){
    state.assetAllComplete = payload;
  },
  setIsPost(state, value) {
    state.isPost = value;
  }
};
const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

export default store

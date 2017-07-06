const state = {
  projectDir: null,
  sessionAction: null,
  integration: null,
};

const mutations = {
  SET_PROJECT_DIR(state, dir){
    state.projectDir = dir
  },
  SET_ACTION(state, action){
    state.sessionAction = action
  },
  SET_INTEGRATION(state, action){
    state.integration = action
  },

};

const actions = {
  setProjectDir({commit}, projectDir) {
    console.log("set project dir", projectDir)
    commit('SET_PROJECT_DIR', projectDir)
  },
  setSessionAction({commit}, action) {
    console.log("action set ", action)
    commit('SET_ACTION', action)
  },
  setIntegration({commit}, integration) {
    console.log("integation set ", integration)
    commit('SET_INTEGRATION', integration)
  }
};

export default {
  state,
  mutations,
  actions,
};

const Store = require('electron-store');
const store = new Store();

console.log("load projects store");
const state = {
  projectDir: null,
  sessionAction: null,
  integration: null,
  recentProjects: store.get("projects.recent", [])
};

const mutations = {
  SET_PROJECT_DIR(state, dir){
    state.projectDir = dir;
    if (dir == null) {
      state.name = null;
      return;
    }
    let parts = dir.split("/");
    state.name = parts[parts.length - 1];
  },
  SET_ACTION(state, action){
    state.sessionAction = action
  },
  SET_INTEGRATION(state, action){
    state.integration = action
  },
  ADD_PROJECT(state, projectPath) {

    for (var i = 0; i < state.recentProjects.length; i++) {
      var rp = state.recentProjects[i];
      if (rp.location == projectPath) {
        state.recentProjects[i].lastAccess = new Date();
        store.set("projects.recent", state.recentProjects);
        return
      }
    }

    state.recentProjects.unshift({
      location: projectPath,
      lastAccess: new Date()
    });
    store.set("projects.recent", state.recentProjects)

  }

};

const actions = {
  setProjectDir({commit}, projectDir) {
    console.log("set project dir", projectDir);
    commit('SET_PROJECT_DIR', projectDir);
    commit('ADD_PROJECT', projectDir);
  },
  setSessionAction({commit}, action) {
    console.log("action set ", action);
    commit('SET_ACTION', action)
  },
  setIntegration({commit}, integration) {
    console.log("integation set ", integration);
    commit('SET_INTEGRATION', integration)
  },
  addProject({commit}, projectLocation) {
    console.log("Add project to recent projects", projectLocation);
    commit('ADD_PROJECT', projectLocation);
  },
};

export default {
  state,
  mutations,
  actions,
};

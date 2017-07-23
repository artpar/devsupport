const Store = require('electron-store');
const store = new Store();

console.log("load projects store");
const state = {
  projectDir: null,
  sessionAction: null,
  integration: null,
  identification: null,
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
  SET_PROJECT_IDENTIFICATION(state, identification){
    state.identification = identification
  },
  SET_INTEGRATION(state, action){
    state.integration = action
  },
  ADD_PROJECT(state, projectPath, identification) {
    // debugger
    if (!projectPath) {
      return
    }
    console.log("add project", projectPath);
    for (var i = 0; i < state.recentProjects.length; i++) {
      var rp = state.recentProjects[i];
      if (rp.location == projectPath) {
        state.recentProjects[i].lastAccess = new Date();
        if (state.recentProjects.length > 6) {
          state.recentProjects = state.recentProjects.slice(0, 6);
        }
        store.set("projects.recent", state.recentProjects);
        return
      }
    }

    let parts = projectPath.split("/");
    var name = parts[parts.length - 1];


    state.recentProjects.unshift({
      location: projectPath,
      lastAccess: new Date(),
      name: name,
      identification: identification,
    });
    store.set("projects.recent", state.recentProjects)

  }

};

const actions = {
  setProjectDir({commit}, projectDir, identification) {
    console.log("set project dir", projectDir);
    commit('SET_PROJECT_DIR', projectDir);
    commit('ADD_PROJECT', projectDir, identification);
  },
  setProjectIdentification({commit}, identification) {
    console.log("set project identification", identification);
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

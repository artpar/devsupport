import Analytics from 'universal-analytics';
const Store = require('electron-store');
const store = new Store();


console.log("load projects store");
const state = {
  projectDir: null,
  sessionAction: null,
  integration: null,
  identification: null,
  currentProject: null,
  recentProjects: store.get("projects.recent", []),
  visitor: [],
  cid: store.get("cid")
};

const mutations = {
  SET_PROJECT_DIR(state, dir){
    state.projectDir = dir;
    if (dir == null) {
      state.currentProject = null;
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
  SET_VISITOR(state){
    if (state.cid == null) {
      state.visitor = new Analytics('UA-103570663-2').debug();
      state.cid = state.visitor.cid;
      console.log("cid length", state.cid.length, "\n cid:", state.cid);
      store.set("cid", state.cid);
    }
    else {
      state.visitor = new Analytics('UA-103570663-2', state.cid).debug();
      console.log("cid from response:", state.visitor.cid, "\n cid from store:", state.cid);
    }
  },


  PAGE_VIEW(state, pageProperties){
    console.log("pageProperties", pageProperties);
    state.visitor.pageview(pageProperties.path, "http://devsupport.ai", pageProperties.title).send();
  },


  GA_EVENT(state, eventProperties){
    console.log("eventProperties", eventProperties);
    state.visitor.event(eventProperties.category, eventProperties.action, eventProperties.label).send();
  },


  ADD_PROJECT(state, projectProperties) {
    // debugger
    if (!projectProperties.projectDir) {
      return
    }
    console.log("add project", projectProperties.projectDir);
    for (var i = 0; i < state.recentProjects.length; i++) {
      var rp = state.recentProjects[i];
      if (rp.location == projectProperties.projectDir) {
        state.currentProject = rp;
        if (projectProperties.identification) {
          rp.identification = projectProperties.identification;
        }
        state.recentProjects[i].lastAccess = new Date();
        if (state.recentProjects.length > 6) {
          state.recentProjects = state.recentProjects.slice(0, 6);
        }
        store.set("projects.recent", state.recentProjects);
        return
      }
    }

    let parts = projectProperties.projectDir.split("/");
    var name = parts[parts.length - 1];


    console.log("New project name", name);
    let newProject = {
      location: projectProperties.projectDir,
      lastAccess: new Date(),
      name: name,
      identification: projectProperties.identification,
    };
    state.recentProjects.unshift(newProject);
    state.currentProject = newProject;
    store.set("projects.recent", state.recentProjects);
    console.log("Updated recent projects");

  }

};

const actions = {
  setProjectDir({commit}, projectProperties) {
    console.log("set project dir", projectProperties.projectDir);
    commit('SET_PROJECT_DIR', projectProperties.projectDir);
    commit('ADD_PROJECT', projectProperties);
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
    commit('ADD_PROJECT', {
      projectPath: projectLocation,
    });
  },
};

export default {
  state,
  mutations,
  actions,
};

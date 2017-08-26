import Analytics from 'universal-analytics';

const Store = require('electron-store');
const store = new Store();


console.log("load projects store");
const state = {
  projectDir: null,
  sessionAction: null,
  integration: null,
  identification: null,
  variables: [],
  secondStageVariables: [],
  variableValidations: [],
  changes: [],
  currentProject: null,
  error: null,
  contextMap: {},
  stage: 1,
  lastStage: 1,
  recentProjects: store.get("projects.recent", []),
  visitor: [],
  cid: store.get("cid")
};

const mutations = {
  SET_VARIABLE_VALIDATIONS(state, validations) {
    state.variableValidations = validations;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PROJECT_DIR(state, dir) {
    state.projectDir = dir;
    if (dir == null) {
      state.currentProject = null;
      state.name = null;
      return;
    }
    let parts = dir.split("/");
    state.name = parts[parts.length - 1];
    state.currentProject = {};
  },
  SET_CONTEXT_MAP(state, contextMap) {
    state.contextMap = contextMap;
  },
  SET_LAST_STAGE(state, lastStage) {
    state.lastStage = lastStage;
  },
  SET_STAGE(state, stage) {
    state.stage = stage;
  },
  SET_CHANGES(state, changes) {
    state.changes = changes;
  },
  SET_VARIABLES(state, variables) {
    console.log("set variableS", variables);
    state.variables = variables;
  },
  SET_SECOND_STAGE_VARIABLES(state, variables) {
    state.secondStageVariables = variables;
  },
  SET_ACTION(state, action) {
    state.sessionAction = action
  },
  SET_PROJECT_IDENTIFICATION(state, identification) {
    state.identification = identification
  },
  SET_INTEGRATION(state, action) {
    state.integration = action
  },
  SET_VISITOR(state) {
    if (state.cid == null) {
      state.visitor = new Analytics('UA-103793943-1').debug();
      // production: UA-103793943-1, testing: UA-103570663-2

      state.cid = state.visitor.cid;
      console.log("cid length", state.cid.length, "\n cid:", state.cid);
      store.set("cid", state.cid);
    }
    else {
      state.visitor = new Analytics('UA-103793943-1', state.cid).debug();
      console.log("cid from response:", state.visitor.cid, "\n cid from store:", state.cid);
    }
  },


  PAGE_VIEW(state, pageProperties) {
    console.log("pageProperties", pageProperties);
    state.visitor.pageview(pageProperties.path, "http://devsupport.ai", pageProperties.title).send();
  },


  GA_EVENT(state, eventProperties) {
    console.log("eventProperties", eventProperties);
    state.visitor.event(eventProperties.category, eventProperties.action, eventProperties.label).send();
  },
  RUN_VARIABLE_VALIDATIONS(state, callback) {

    if (state.changes.length === 0) {
      callback([]);
    } else {
      state.changes[0].runVariableValidations(state.contextMap, state.variableValidations).then(function (result) {
        callback(result);
      }).catch(function(failure){
        callback(failure);
      })
    }

  },
  DO_CHANGES(state, callback) {

    function doIndex(ith, doIndex) {
      console.log("do change", ith);
      if (state.changes.length == ith) {
        if (callback) {
          callback();
        }
        return;
      }
      state.changes[ith].doChanges(state.contextMap).then(function () {
        doIndex(ith + 1, doIndex);
      }).catch(function () {
        doIndex(ith + 1, doIndex);
      });
    }

    doIndex(0, doIndex);

  },
  EVALUATE_TEMPLATES(state) {
    state.changes.map(function (liveChange) {
      liveChange.evaluateTemplates(state.contextMap)
    });
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
  setError({commit}, error) {
    commit('SET_ERROR', error);
  },
  setProjectDir({commit}, projectProperties) {
    console.log("set project dir", projectProperties.projectDir);
    commit('SET_PROJECT_DIR', projectProperties.projectDir);
    commit('ADD_PROJECT', projectProperties);
    commit("SET_ERROR", null);
  },
  runVariableValidations({commit}, callback) {
    commit("RUN_VARIABLE_VALIDATIONS", callback)
  },
  doChanges({commit}, callback) {
    commit("DO_CHANGES", callback)
  },
  setVariableValidations({commit}, validations) {
    commit("SET_VARIABLE_VALIDATIONS", validations)
  },
  evaluateTemplates({commit}) {
    commit("EVALUATE_TEMPLATES")
  },
  setSessionAction({commit}, action) {
    console.log("action set ", action);
    commit('SET_ACTION', action)
  },
  setIntegration({commit}, integration) {
    console.log("integation set ", integration);
    commit('SET_INTEGRATION', integration)
  },
  setLastStage({commit}, lastStage){
    commit("SET_LAST_STAGE", lastStage)
  },
  setStage({commit}, stage){
    commit("SET_STAGE", stage)
  },
  setChanges({commit}, changes) {
    commit("SET_CHANGES", changes);
  },
  setContextMap({commit}, contextMap) {
    commit("SET_CONTEXT_MAP", contextMap)
  },
  setVariables({commit}, variables) {
    commit("SET_VARIABLES", variables);
  },
  setSecondStageVariables({commit}, variables) {
    commit("SET_SECOND_STAGE_VARIABLES", variables)
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

/**
 * Created by artpar on 7/20/17.
 */
import  JsonApi from "devour-client"
import axios from 'axios';
import appConfig from '../plugins/appconfig';

const jsonapi = new JsonApi({
  apiUrl: appConfig.apiRoot + '/api',
  pluralize: false
});


function GetJsonApiModel(columnModel) {
  // console.log('get json api model for ', columnModel);
  var model = {};
  if (!columnModel) {
    console.log("Column model is empty", columnModel);
    return model;
  }

  var keys = Object.keys(columnModel);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    var data = columnModel[key];

    if (data["jsonApi"]) {
      model[key] = data;
    } else {
      model[key] = data.ColumnType;
    }
  }

  // console.log("returning model", model)
  return model;

};

var models = ["usergroup", "merchant", "integration","faq","feedback", "user_account"];
models.map(function (mode) {
  axios(appConfig.apiRoot + '/jsmodel/' + mode + '.js', {
    headers: {},
  }).then(function (r) {
    console.log("loaded js model", r);
    jsonapi.define(mode, GetJsonApiModel(r.data.ColumnModel));
  });
});

export default jsonapi;

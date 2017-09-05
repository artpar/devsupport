const AppConfig = function () {

  const that = this;

  console.log("define app config", window.location.protocol, window.location.hostname);

  that.apiRoot = "https://api.devsupport.ai";

  that.location = {
    protocol: window.location.protocol,
    host: window.location.host,
    hostname: window.location.hostname,
  };

  const that1 = this;

  that1.data = {};

  that.localStorage = {
    getItem: function (key) {
      return that1.data[key]
    },
    setItem: function (key, item) {
      that1.data[key] = item;
    }
  };

  return that;
};


const appconfig = new AppConfig();


export default appconfig

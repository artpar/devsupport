const AppConfig = function () {

  const that = this;

  console.log("define app config", window.location.protocol, window.location.hostname);


  that.apiRoot = "https://api.devsupport.ai"
  if (process.env.NODE_ENV !== "production") {
    that.apiRoot = "http://sandbox.devsupport.ai:6336";
  }
  console.log("Api root is", that.apiRoot);

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

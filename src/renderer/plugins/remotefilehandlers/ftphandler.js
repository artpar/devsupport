


export default function (params, logger) {
  var that = {};
  that.params = params;
  that.logger = logger;
  console.log("new ftp change handler", params, logger)
  return that;


}
module.express     = require("./node_modules/express");
module.webServ     = module.express();

module.exports = {
  startListeningOnPort : function(port,func){
    module.webServ.listen(port,func);
  },
  setupListenerOnURL   : function(path,func){
    module.webServ.get(path,func)
  },
  returnCurrentServerStatus : function(){
    return module.webServ;
  },
  goto : function(url){
      /*
            TODO AUTOMATE USER CLICKING
            Failed with express/request/zombie js
      */
    return url;
  },

};
module.Bot;
module.SlackBot = require('slackbots');

module.exports = {
  setUpAuthentication : function(token, name){
     module.Bot = new module.SlackBot({
        token: token, 
        name: name
    });
  },
  returnCurrentBotStatus : function(){
      return module.bot;
  },
  setUpListenerFunction: function(func){
    module.Bot.on('message',func)
  },
  setUpResponseFunction: function(user,msg,func){
      module.Bot.postMessageToUser(user, msg, func);

  }
};
var confObject        = require("./conf.js")              // import config
var slackController   = require("./slackController.js")   // import slack   function
var spotifyController = require("./spotifyController.js") // import spotify functions
var WebServController = require("./webServerController") // import spotify functions
var colors            = require('colors');


//////////////////////////////////////////////////
//                                              //
//                Verify Config                 //
//                                              //
//////////////////////////////////////////////////
for(var key in confObject){
    if (confObject.hasOwnProperty(key)) {
        if(confObject[key] == undefined || confObject[key] == ""){
          console.warn(key.red + " is undefined!".red)
        }
    }
}
//////////////////////////////////////////////////
//                                              //
//                Set up Spotify                //
//                                              //
//////////////////////////////////////////////////

// set up spotify authentication give it the total config to set up
spotifyController.setUpAuthentication(confObject)
// set up blacklist -> items that wont be added to the playlist
var blacklist = [
    "3oEHQmhvFLiE7ZYES0ulzv"
]
spotifyController.setBlackList(blacklist)


// todo fix automating this stuff..
console.log(spotifyController.returnAuthenticationURL());

//////////////////////////////////////////////////
//                                              //
//                Set up Webserver              //
//                                              //
//////////////////////////////////////////////////
var listeningPort = confObject.webserverListenPort;
WebServController.startListeningOnPort(listeningPort)

// where we are going to recieve our spotify tokens
function callbackMethod(req, res){
    console.log("==Token:==".blue)    
    console.log((req.query.code).yellow);
    var authorizationCode = req.query.code;
    console.log("==========".blue)
    res.send("thx");    // return something to make the browser happy

    // pass the token/code to the spotify controller and start authentication
    spotifyController.initialiseAuthentication(authorizationCode);
}
// alternative way of adding a song
//http://localhost:8888/song?artist=lorum&song=ipsum
//http://localhost:8888/song?artist=cake&song=conroy
function restSongSelection(req, res){
    /*
    console.log("==== Got Rest Call For Song ====".blue)  
    console.log("Artist: ".yellow +(req.query.artist).yellow)  
    console.log("Song: ".yellow +(req.query.song).yellow);
    console.log("================================".blue);
    */
    //spotifyController.addSongToPlayList(req.query.artist,req.query.song);
    res.send(spotifyController.addSongToPlayList(req.query.artist,req.query.song));    // return something to make the browser happy
}
WebServController.setupListenerOnURL("/callback",callbackMethod);
WebServController.setupListenerOnURL("/song",restSongSelection);
//WebServController.goto(spotifyController.returnAuthenticationURL());


//////////////////////////////////////////////////
//                                              //
//                Set up Slack                  //
//                                              //
//////////////////////////////////////////////////

// set up the slack authentication 
slackController.setUpAuthentication(
    confObject.slackBotToken,
    confObject.slackBotName             
);

// set up custom listener 
// data contains more than we need(notifications, get alive pings, status changes)
// so we filter only on messages from users by checking if the 'subtitle' is not undefined
var slackListener = function(data){
    if(data.subtitle != undefined){
        // slack returns our bot user as: user (bot), we split so it matches our confObj slackBotName
        var botname = data.subtitle.split(" ")              
        if(botname[0] != confObject.slackBotName){
            //console.log(data.subtitle); <- user who send our bot a messages
            //console.log(data.content);  <- the message content
            var msgContent = data.content;
            // to make sure the data.content is not undefined..
            if(msgContent != undefined){
                var tempSplitContent = msgContent.split(" ");
                switch(tempSplitContent[0]){
                    case "Show":
                    case "show":                // switch abuse
                    case "Playlist":
                    case "playlist":
                        slackController.setUpResponseFunction(data.subtitle,"[TODO] - Implement print playlist")
                        break;
                    case "Help" :
                    case "help" :               // switch abuse
                        slackController.setUpResponseFunction(data.subtitle,"[TODO] - Implement help section")
                        break;
                    case "About" :
                    case "about" :
                        slackController.setUpResponseFunction(data.subtitle,"[TODO] - Implement about section")
                        break;
                    default:
                        var tempSplitContent = msgContent.split(" - ");
                        var containsDash = (msgContent.indexOf("-") > -1);
                        if(tempSplitContent.length != 0 && containsDash){
                            spotifyController.addSongToPlayList(tempSplitContent[0],tempSplitContent[1]);
                            function timeOutFunction(){
                                slackController.setUpResponseFunction(data.subtitle,spotifyController.updateNotice())
                            }
                            setTimeout(timeOutFunction, 3000);
                        }else{
                            slackController.setUpResponseFunction(data.subtitle,"Requests syntax should be [artist] - [song]. type 'help' for more information")
                        }
                        break;
                }
            }else{
                // incase there is an empty message..  ? 
                slackController.setUpResponseFunction(data.subtitle,"Requests syntax should be [artist] - [song]")
            }
        }
    }
}
// add listerner to our slack bot controller
slackController.setUpListenerFunction(slackListener)





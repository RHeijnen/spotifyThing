var SpotifyWebApi         = require('spotify-web-api-node');
var express               = require("./node_modules/express");
var app                   = express();
var SlackBot = require('slackbots');

/*
    Slack stuff
*/

 
// create a bot 
var bot = new SlackBot({
    token: '[[slackbot token removed]]', // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: 'BAMusic'
});
 
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.content);
    
    var tempString = data.content //|| '';
    if(data.content != undefined){
        var tempSplitContent = tempString.split(" - ");
        var containsDash = (tempString.indexOf("-") > -1);
        if(tempSplitContent.length != 0 &&  containsDash){
            console.log(tempSplitContent)
            console.log(tempSplitContent.length)
            playSong(tempSplitContent[0],tempSplitContent[1]);
        }
    }

});
  

////


var authorizationCode = '<insert authorization code>';
var selectedSong      = 'blabla'




var scopes = ['playlist-modify-private', 'playlist-modify-public'],
    redirectUri = 'http://localhost:8888/callback',
    clientId = 'aac1935c8b324142a277212d55b47155',
    state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  clientId : [[client id removed]]
  clientSecret : [[client secret removed]]
  redirectUri : 'http://localhost:8888/callback'
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);
console.log("===Click this link to authenticate user===")
// listen for the authentication code
app.listen(8888, function () {
  console.log('-----------------------Awaiting user authentication URI on localhost:8888--------------------------');
});

// /callback listener.
app.get('/callback', function (req, res) {
    console.log("==Token:==")    
    console.log(req.query.code);
    authorizationCode = req.query.code;
    console.log("=====")
    res.send("thx");    // return something to make the browser happy
    initSpotifyStuff(authorizationCode)
});
//http://localhost:8888/song?artist=%22test%20test%22&song=%22boom%20boom%22
app.get('/song', function (req, res) {
    console.log("==REST artist:==")    
    console.log(req.query.artist);
    console.log("==REST song:==")    
    console.log(req.query.song);
    res.send("thx");    // return something to make the browser happy
    playSong(req.query.artist,req.query.song)
});
playSong = function(artist,song){
    spotifyApi.searchTracks('track:'+song+' artist:'+artist).then(function(data) {
          // lets just assume the first one is always the artist we want. deal with it, innit ?
          console.log(data.body.tracks.items[0].artists[0].name)
          console.log(data.body.tracks.items[0].name)
          console.log(data.body.tracks.items[0].id)
          console.log("--")
          selectedSong = data.body.tracks.items[0].id;
}).then(function(data) {
    spotifyApi.addTracksToPlaylist('81ayef4r6a3j5qqo2dyka232t', '4fzq8Tbt4Oybg9gHlkwcgx', ["spotify:track:"+selectedSong]).then(function(data) {
            console.log('Added tracks to playlist!');
          }, function(err) {
            console.log('Something went wrong trying to add the song to the playlist \n', err +" \n ========");
    });
});
}

initSpotifyStuff = function(authenticationCode){
    // First retrieve an access token
    spotifyApi.authorizationCodeGrant(authenticationCode).then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    }, function(err) {
        console.log('Something went wrong authorizationCodeGrant!', err);
    });

}


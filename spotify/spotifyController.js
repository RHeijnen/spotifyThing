module.SpotifyWebApi   = require("spotify-web-api-node");
module.blackList       = [];
module.playlistContent = [];
module.SpotifyAPI;
module.AuthUrl;
module.SpotifyToken;
module.userID;
module.playlistID;
module.selectedSong;
module.stringNotice;

module.isBlackListed = function(){
    for(var i = 0; i < module.blackList.length;i++){
        if(module.blackList[i] == module.selectedSong){
            return true;
        }
    }
    return false;
}
module.exports = {
  setUpAuthentication : function(confObject){
    // setup spotify API credentials object
    module.SpotifyAPI = new module.SpotifyWebApi({
        clientId      : confObject.spotifyClientID,
        clientSecret  : confObject.spotifyClientSecret,
        redirectUri   : confObject.spotifyRedirectURI
    });
    // save the playlist for future refrences
    module.userID      = confObject.spotifyUserID;
    module.playlistID  = confObject.spotifyPlaylistID;
    // create authentication URL 
    module.AuthUrl = module.SpotifyAPI.createAuthorizeURL(
        confObject.spotifyScopeAuth, 
        confObject.spotifyRedirectState
    );
  },
  returnCurrentApiStatus : function(){
      return module.SpotifyAPI;
  },
  returnAuthenticationURL : function(){
      return module.AuthUrl;
  },
  setBlackList : function(arrayOfBlacklistedItems){
      module.blackList = arrayOfBlacklistedItems;
  },
  initialiseAuthentication: function(token){
    module.SpotifyAPI.authorizationCodeGrant(token).then(function(data) {
        module.SpotifyAPI.setAccessToken(data.body["access_token"]);
        module.SpotifyAPI.setRefreshToken(data.body["refresh_token"]);
    }, function(err) {
        console.log("Something went wrong authorizationCodeGrant!", err);
    });
  },
  updateNotice : function(){
        // pass messages back to main.js so we can then pass them to slack
        return module.stringNotice;
  },
  addSongToPlayList : function(artist,song){
    module.SpotifyAPI.searchTracks("track:"+song+" artist:"+artist).then(function(data) {
        if(data.body.tracks.items[0] != undefined){
            //console.log("song found");
            module.selectedSong = data.body.tracks.items[0].id;
            //console.log(data.body.tracks.items[0].id);
        }else{
            //console.log("song not found");
            module.selectedSong = "";           // uhg
            module.stringNotice =  "song not found"
        }
        // lets just assume the first one is always the artist we want.
    }).then(function(data) {
        if(module.isBlackListed() == false){
            module.SpotifyAPI.addTracksToPlaylist(module.userID, module.playlistID, ["spotify:track:"+module.selectedSong]).then(function(data) {
                    console.log("Added tracks to playlist!".green);
                    module.stringNotice =  "Added track to playlist!"
                }, function(err) {
                    console.log("========".red +"\n" + "Something went wrong trying to add the song to the playlist. \n".red +("" + err ).bgRed+" \n ========".red);
                    module.stringNotice =  "Something went wrong trying to add the song to the playlist \n" + err.red 
            });
        }else{
            switch(module.selectedSong){
                case "1":
                case "2":                
                case "3":
                case "4" :
                case "5" :               
                case "6" :
                case "3oEHQmhvFLiE7ZYES0ulzv" : // celine dion - my heart will go on
                    console.log("Got Celine Dion - My heart will go on, sending image".rainbow);
                    module.stringNotice =  " https://slack-imgs.com/?c=1&url=http%3A%2F%2Fmedia3.giphy.com%2Fmedia%2FJyLrvtoeR86NW%2Fgiphy.gif \n http://i.imgur.com/[TODO INSERT DIOGO].jpg"
                    break;
                default:
                    console.log("blacklisted")
                    break;
            }
        }
    });

  },
};

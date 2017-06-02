var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'aac1935c8b324142a277212d55b47155',
  clientSecret : '54e7a0cc8f9e4578b1b34a9e8b941f3c',
  //redirectUri : 'http://www.example.com/callback'
});
var selectedSong = "";
// lets try this 
//spotifyApi.setAccessToken('<your_access_token>');

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(function(data) {

    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    // then we do....
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
}).then(function(data) {
    spotifyApi.searchTracks('track:Rosana artist:Wax').then(function(data) {
          // lets just assume the first one is always the artist we want. deal with it, innit ?
          console.log(data.body.tracks.items[0].artists[0].name)
          console.log(data.body.tracks.items[0].name)
          console.log(data.body.tracks.items[0].id)
          console.log("--")
          selectedSong = data.body.tracks.items[0].id;
    });
}).then(function(data) {
spotifyApi.getMe().then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong trying to get authenticated user details', err);
  });
}).then(function(data) {
  /*
spotifyApi.getPlaylist('81ayef4r6a3j5qqo2dyka232t', '4fzq8Tbt4Oybg9gHlkwcgx').then(function(data) {
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong trying to GET playlist', err);
  });
  */
}).then(function(data) {
  
    spotifyApi.addTracksToPlaylist('81ayef4r6a3j5qqo2dyka232t', '4fzq8Tbt4Oybg9gHlkwcgx', ["spotify:track:4pMNNRAWE3Kd1adULOApgV"]).then(function(data) {
            console.log('Added tracks to playlist!');
          }, function(err) {
            console.log('Something went wrong trying to add the song to the playlist \n', err +" \n ========");
    });
    
});









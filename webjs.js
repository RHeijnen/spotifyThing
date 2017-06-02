        var mainContainer = document.getElementById('js-main-container');
        var loginContainer = document.getElementById('js-login-container');
        var loginButton = document.getElementById('login');
        var background = document.getElementById('js-background');
        var spotifyPlayer = new SpotifyPlayer();
        var spotifyPlaylistIframe = document.getElementById("playlistIframe");
        var spotifyPlayListDiv    = document.getElementById("iframeContainer");

        var template = function (data) {
        return `
            <div class="main-wrapper">
            <div class="now-playing__img">
                <img src="${data.item.album.images[0].url}">
            </div>
            <div class="now-playing__side">
                <div class="now-playing__name">${data.item.name}</div>
                <div class="now-playing__artist">${data.item.artists[0].name}</div>
                <div class="now-playing__status">${data.is_playing ? 'Playing' : 'Paused'}</div>
                <div class="progress">
                <div class="progress__bar" style="width:${data.progress_ms * 100 / data.item.duration_ms}%"></div>
                </div>
            </div>
            </div>
            <div class="background" style="background-image:url(${data.item.album.images[0].url})"></div>
        `;
        };
        playlistBadWorkAroundIShouldFeelShame = function(){

          spotifyPlayListDiv.innerHTML = "";
          spotifyPlayListDiv.innerHTML = `
          <iframe src="https://open.spotify.com/embed?uri=spotify:user:81ayef4r6a3j5qqo2dyka232t:playlist:4fzq8Tbt4Oybg9gHlkwcgx" id"playlistIframe" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>        
          `;
        };

        spotifyPlayer.on('update', response => {
            mainContainer.innerHTML = template(response);
        });

        spotifyPlayer.on('login', user => {
        if (user === null) {
            loginContainer.style.display = 'block';
            mainContainer.style.display = 'none';
        } else {
            loginContainer.style.display = 'none';
            mainContainer.style.display = 'block';
        }
        });

        loginButton.addEventListener('click', () => {
            spotifyPlayer.login();
        });

        spotifyPlayer.init();


        function lazyRefreshThingy(){
          playlistBadWorkAroundIShouldFeelShame();
        }
        lazyRefreshThingy();
        //setInterval(lazyRefreshThingy,10000);

var token;

function load(){
    //Gain acces token
    $.ajax(
        {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: {
                "grant_type":    "client_credentials",
                "client_secret": '6ee1ce7bc9314b649d2e63f4e75e4fa1',
                "client_id":     '2968ba29b9ef4273996a7bce880c458b',
            },
            success: function(result) {
            token = result.access_token;
            },
        });
}

function search(){
    //search artist
    var artistID;
    const artistv = document.getElementById('artist').value;

    //verfiy that there was an input in to the textbox
    if (artistv.length == 0){
        alert("Plase type an artist name");
        return
    }
    else{
        //Search to retive artist ID
        $.ajax(
        {
            method: 'GET',
            url: 'https://api.spotify.com/v1/search?q=' + artistv + '&type=artist',
            headers: { 'Authorization' : 'Bearer ' + token},
            success: function(result) {
            artistID = result.artists.items[0].id;

            //Display artist top three tracks
            $.ajax(
            {
                method: 'GET',
                url: 'https://api.spotify.com/v1/artists/' + artistID,
                headers: { 'Authorization' : 'Bearer ' + token},
                success: function(result) {
                    console.log(result)
                    //retives artist picture and name
                    let image = result.images[0].url;
                    let name = result.name;
                    let artistURL = result.external_urls.spotify;
                    $('#pfp').replaceWith('<img id="pfp" src="' + image + '">');
                    $('#name').replaceWith('<h3 id="name">' + '<a href="' + artistURL + '">' + name + '</a>' + '</h3>')
                },
                error: function (jqXHR) {
                    if (jqXHR.status === 0) {
                        alert('Not connect. Verify Network.');
                    } else if (jqXHR.status == 404) {
                        alert('Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        alert('Internal Server Error [500].');
                    } else if (jqXHR.status == 401) {
                        alert('Authorizion failed. [401]');
                    } else {
                        alert('Uncaught Error.' + jqXHR.responseText);
                    }
                },
            });

            $.ajax(
                {
                    method: 'GET',
                    url: 'https://api.spotify.com/v1/artists/'+ artistID + '/top-tracks?market=ES',
                    headers: { 'Authorization' : 'Bearer ' + token},
                    success: function(result) {
                        console.log(result);
                        //retrive artist top three track images
                        $('.track').each(function(index){
                            let track = result.tracks[index].album.images[1].url;
                            $(this).replaceWith('<img class="track" src="' + track + '">');
                        });
                        //retrive artist top three track names
                        $('.trackName').each(function(index){
                            let trackName = result.tracks[index].name;
                            let trackURL = result.tracks[index].external_urls.spotify;
                            $(this).replaceWith('<p class="trackName"> Song Name: ' + '<a href="' + trackURL + '">' + trackName + '</a>' + '</p>');
                        });
                        //retrive the album the tracks are from
                        $('.albumName').each(function(index){
                            let albumName = result.tracks[index].album.name;
                            let albumURL = result.tracks[index].album.external_urls.spotify
                            $(this).replaceWith('<p class="albumName"> Album Name: '+ '<a href="' + albumURL + '">' + albumName + '</a>' + '</p>');
                        });
                    },
                    error: function (jqXHR) {
                        if (jqXHR.status === 0) {
                            alert('Not connect. Verify Network.');
                        } else if (jqXHR.status == 404) {
                            alert('Requested page not found. [404]');
                        } else if (jqXHR.status == 500) {
                            alert('Internal Server Error [500].');
                        } else if (jqXHR.status == 401) {
                            alert('Authorizion failed. [401]');
                        } else {
                            alert('Uncaught Error.' + jqXHR.responseText);
                        }
                    },
                });
            },
            error: function (jqXHR) {
                if (jqXHR.status === 0) {
                    alert('Not connect. Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (jqXHR.status == 401) {
                    alert('Authorizion failed. [401]');
                } else {
                    alert('Uncaught Error.' + jqXHR.responseText);
                }
            },
        });   
    }
    
    
}

window.onload = function (evt) {
    
    if (document && document.getElementById) {
        load();
        document.getElementById('submit').onclick = search;
    }
}
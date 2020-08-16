import {DEEZER_TOKEN, DeezerAppId, DeezerAppSecret, SPOTIFY_TOKEN, SpotifyAppId, SpotifyAppSecret} from '../constants'
import _ from 'lodash';

const HEROKU_PROXY = 'https://cors-anywhere.herokuapp.com';

export async function getDeezerToken(code){
    const req = await fetch(`https://connect.deezer.com/oauth/access_token.php?app_id=${DeezerAppId}&secret=${DeezerAppSecret}&code=${code}`,
        {
            method:'POST',
        });
    const r = await req.text()
    const token = r.split('&')[0].split('=')[1];
    localStorage.setItem(DEEZER_TOKEN, token);
}

export async function getDeezerPlaylists(){
    const req = await fetch(`https://api.deezer.com/user/me/playlists?access_token=${localStorage.getItem(DEEZER_TOKEN)}`,);
    const body = await req.json();
    return body.data;
}

export async function getDeezerPlaylistTracks(playlistId){
    const req = await fetch(`https://api.deezer.com/playlist/${playlistId}/tracks?access_token=${localStorage.getItem(DEEZER_TOKEN)}`,);
    const body = await req.json();
    return body.data;
}

export async function getSpotifyToken(code){
    const req = await fetch(`https://accounts.spotify.com/api/token`,
    {
        method:'POST',
        body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/spotify`,
        headers:{
            'Content-type':'application/x-www-form-urlencoded',
            'Authorization':'Basic ' + btoa(`${SpotifyAppId}:${SpotifyAppSecret}`)
        }
    });

    const r = await req.json();

    const t = JSON.stringify({access_token:r.access_token, refresh_token:r.refresh_token, expiration_date: new Date(Date.now() + 3600000)})
    localStorage.setItem(SPOTIFY_TOKEN, t);
}

export async function preventSpotifyTokenExpiration(){
    const expirationDate = JSON.parse(localStorage.getItem(SPOTIFY_TOKEN)).expiration_date;

    if(new Date(expirationDate) <= new Date()){
        const refresh_token = JSON.parse(localStorage.getItem(SPOTIFY_TOKEN)).refresh_token;
        const req = await fetch(`https://accounts.spotify.com/api/token`,
        {
            method:'POST',
            body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${SpotifyAppId}`,
            headers:{
                'Content-type':'application/x-www-form-urlencoded',
                'Authorization':'Basic ' + btoa(`${SpotifyAppId}:${SpotifyAppSecret}`)
            }
        });

        const r = await req.json();

        const t = JSON.stringify({access_token:r.access_token, refresh_token:r.refresh_token, expiration_date: new Date(Date.now() + 3600000)})
        localStorage.setItem(SPOTIFY_TOKEN, t);
    }
}

export async function getSpotifyPlaylists(){
    await preventSpotifyTokenExpiration();

    const req = await fetch(`${HEROKU_PROXY}/https://api.spotify.com/v1/me/playlists`,
        {
            headers:{
                'Authorization':`Bearer ${JSON.parse(localStorage.getItem(SPOTIFY_TOKEN)).access_token}`
            }
        }
    );
    const body = await req.json();
    return body.items;
}

export async function getSpotifyPlaylistTrack(playlistId, page = 0){
    await preventSpotifyTokenExpiration();

    const req = await fetch(`${HEROKU_PROXY}/https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${0 + (100 * page)}`,
        {
            headers:{
                'Authorization':`Bearer ${JSON.parse(localStorage.getItem(SPOTIFY_TOKEN)).access_token}`
            }
        }
    );
    const body = await req.json();
    return body.items;
}

export async function transferSpotifyPlaylistToDeezerPlaylist(spotifyPlaylistInfo, deezerPlaylistId){
    const SPOTIFY_PAGE_SIZE_MAX = 100;
    const NB_SPOTIFY_PLAYLIST_PAGES = Math.ceil(spotifyPlaylistInfo.totalTracks / SPOTIFY_PAGE_SIZE_MAX);

    const spotifyTracks =[];
    const deezerSongs = [];
    var deezerIds = [];
    var notFoundSongs = [];

    for(let i = 0; i < NB_SPOTIFY_PLAYLIST_PAGES; i++){
        const t = await getSpotifyPlaylistTrack(spotifyPlaylistInfo.id, i);
        spotifyTracks.push(...t);
    }

    for(let i = 0; i < spotifyTracks.length; i++){
        const t = spotifyTracks[i];

        console.log(`${t.track.name} - ${t.track.artists[0].name}`);

        t.track.name = t.track.name.split('(')[0];

        const deezerSearchQuery = await fetch(`https://api.deezer.com/search?q=artist:"${t.track.artists[0].name}" track:"${t.track.name}"`);

        const deezerResult = await deezerSearchQuery.json();

        if(deezerResult.data && deezerResult.data[0]){
            console.log('Deezer song ID : ', deezerResult.data[0].id);
            deezerSongs.push({
                deezerId: deezerResult.data[0].id,
                song: `${t.track.name} - ${t.track.artists[0].name}`
            })
            deezerIds.push(deezerResult.data[0].id);
        }
        else{
            notFoundSongs.push({
                track: t.track.name,
                artist: t.track.artists[0].name
            });
            console.log('Song not found')
        }
    }

    const uniqueDeezersIds = deezerIds.filter((v,i) => deezerIds.indexOf(v) === i);
    const duplicatedIds = deezerIds.filter((v,i) => deezerIds.indexOf(v) !== i);

    const uniqueObjects = _.uniqBy(deezerSongs, 'deezerId');

    console.log(uniqueObjects.length)

    console.log(`Songs not found : `, notFoundSongs);
    console.log(`${duplicatedIds.length} duplicate(s) deleted : `, duplicatedIds)

    // const updateRequest = await fetch(`https://api.deezer.com/playlist/${deezerPlaylistId}/tracks?access_token=${localStorage.getItem(DEEZER_TOKEN)}&songs=${uniqueDeezersIds.join(',')}`,
    // {
    //     method: 'POST'
    // });
    // const updateResponse = await updateRequest.json();

    // console.log('Udpate response : ', updateResponse);
}
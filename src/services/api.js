import {DEEZER_TOKEN, DeezerAppId, DeezerAppSecret, SPOTIFY_TOKEN} from '../constants'

const HEROKU_PROXY = 'https://cors-anywhere.herokuapp.com';

export async function getDeezerToken(code){
    const req = await fetch(`${HEROKU_PROXY}/https://connect.deezer.com/oauth/access_token.php?app_id=${DeezerAppId}&secret=${DeezerAppSecret}&code=${code}`,
        {
            method:'POST',
            headers:{
                origin:'*'
            }
        });
    const r = await req.text()
    const token = r.split('&')[0].split('=')[1];
    localStorage.setItem(DEEZER_TOKEN, token);
}

export async function getDeezerPlaylists(){
    const req = await fetch(`${HEROKU_PROXY}/https://api.deezer.com/user/me/playlists?access_token=${localStorage.getItem(DEEZER_TOKEN)}`);
    const body = await req.json();
    return body.data;
}

export async function getDeezerPlaylistTracks(playlistId){
    const req = await fetch(`${HEROKU_PROXY}/https://api.deezer.com/playlist/${playlistId}/tracks?access_token=${localStorage.getItem(DEEZER_TOKEN)}`);
    const body = await req.json();
    return body.data;
}

export async function getSpotifyPlaylists(){
    const req = await fetch(`${HEROKU_PROXY}/https://api.spotify.com/v1/me/playlists`,
        {
            headers:{
                'Authorization':`Bearer ${localStorage.getItem(SPOTIFY_TOKEN)}`
            }
        }
    );
    const body = await req.json();
    return body.items;
}

export async function getSpotifyPlaylistTrack(playlistId, page = 0){
    const req = await fetch(`${HEROKU_PROXY}/https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${page}`,
        {
            headers:{
                'Authorization':`Bearer ${localStorage.getItem(SPOTIFY_TOKEN)}`
            }
        }
    );
    const body = await req.json();
    return body.items;
}

export async function transferSpotifyPlaylistToDeezerPlaylist(spotifyPlaylistInfo, deezerPlaylistInfo){
    const SPOTIFY_PAGE_SIZE_MAX = 100;
    const NB_SPOTIFY_PLAYLIST_PAGES = Math.ceil(spotifyPlaylistInfo.totalTracks / SPOTIFY_PAGE_SIZE_MAX);

    const spotifyTracks =[];

    for(let i = 0; i < NB_SPOTIFY_PLAYLIST_PAGES; i++){
        //Make the loop wait before iteration
        const t = await getSpotifyPlaylistTrack(spotifyPlaylistInfo.id, i);
        spotifyTracks.push(...t);
    }

    spotifyTracks.forEach(t =>{
        console.log(t)
    });
}
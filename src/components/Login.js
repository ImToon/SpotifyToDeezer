import React, {useEffect} from 'react';
import {SPOTIFY_TOKEN, DEEZER_TOKEN, SPOTIFY_URL, DEEZER_URL,} from '../constants'
import Playlists from './Playlists';

function Login() {
    const spotifyToken = localStorage.getItem(SPOTIFY_TOKEN);
    const deezerToken = localStorage.getItem(DEEZER_TOKEN);

    useEffect(()=>{
    }, [])

    return (
       <>
        <p>Login to both platforms</p>

        <div>
            {
                spotifyToken?
                <p>Connected to Spotify</p>
                :
                <a href={SPOTIFY_URL}>Connect to Spotify</a>
            }
        </div>

        <div>
            {
                deezerToken?
                <p>Connected to Deezer</p>
                :
                <a href={DEEZER_URL}>Connect to Deezer</a>
            }
        </div>

       <Playlists />

       </>
    );
}

export default Login;
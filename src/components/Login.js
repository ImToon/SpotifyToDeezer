import React, {useEffect} from 'react';
import {SPOTIFY_TOKEN, DEEZER_TOKEN, SPOTIFY_URL, DEEZER_URL,} from '../constants'
import Playlists from './Playlists';
import SpotifyLogo from '../assets/spotify.png';
import DeezerLogo from '../assets/deezer.png';

function Login() {
    const spotifyToken = localStorage.getItem(SPOTIFY_TOKEN);
    const deezerToken = localStorage.getItem(DEEZER_TOKEN);

    useEffect(()=>{
    }, [])

    return (
       <>
        <p>You need to be connected to both platforms</p>

        <div className="row">
            <div className="col">
                {
                    spotifyToken?
                    <p>Connected to Spotify</p>
                    :
                    <div className="col">
                        <img className="row" width={100} height={100} src={SpotifyLogo}/>
                        <a className="row" href={SPOTIFY_URL}>Connect to Spotify</a>
                    </div>
                }
            </div>

            <div className="col">
                {
                    deezerToken?
                    <p>Connected to Deezer</p>
                    :
                    <div className="col">
                        <img className="row" width={150} height={100} src={DeezerLogo}/>
                        <a className="row" href={DEEZER_URL}>Connect to Deezer</a>
                    </div>
                }
            </div>
       </div>

       <Playlists />

       </>
    );
}

export default Login;
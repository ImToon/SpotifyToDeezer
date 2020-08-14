import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {SPOTIFY_TOKEN} from '../constants'

function SpotifyLogin() {
    const history = useHistory();

    const getToken = async () => {
        const token = window.location.href.split('#')[1].split('&')[0].split('=')[1];
        localStorage.setItem(SPOTIFY_TOKEN, token);
        history.push('/')
    }

    useEffect(()=>{
        getToken();
    }, [])

    return (
        <p>Spotify</p>
    );
}

export default SpotifyLogin;
import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import {SPOTIFY_TOKEN} from '../constants'
import { getSpotifyToken } from '../services/api';

function SpotifyLogin() {
    const history = useHistory();

    const getToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        await getSpotifyToken(code);
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
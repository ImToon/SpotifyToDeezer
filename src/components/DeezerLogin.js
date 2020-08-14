import React, {useEffect,} from 'react';
import {getDeezerToken} from '../services/api';
import { useHistory } from "react-router-dom";

function DeezerLogin() {
    const history = useHistory();

    const getToken = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        await getDeezerToken(code);
        history.push('/')
    }

    useEffect(()=>{
        getToken();
    }, [])

    return (
        <p>Deezer</p>
    );
}

export default DeezerLogin;

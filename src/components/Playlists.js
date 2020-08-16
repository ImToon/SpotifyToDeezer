import React, {useEffect, useState} from 'react';
import {SPOTIFY_TOKEN, DEEZER_TOKEN} from '../constants'
import {getDeezerPlaylists, getSpotifyPlaylists, transferSpotifyPlaylistToDeezerPlaylist} from '../services/api';
function Playlists() {
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
    const [deezerPlaylists, setDeezerPlaylists] = useState([]);
    const spotifyToken = JSON.parse(localStorage.getItem(SPOTIFY_TOKEN))?.access_token;
    const deezerToken = localStorage.getItem(DEEZER_TOKEN);

    const getPlaylists = async ()=>{
        const sp = await getSpotifyPlaylists();
        const dp = await getDeezerPlaylists();
        setDeezerPlaylists(dp);
        setSpotifyPlaylists(sp);
    }

    useEffect(()=>{
        if(spotifyToken && deezerToken){
            getPlaylists();
            // transferSpotifyPlaylistToDeezerPlaylist({id:"4h2RpMS5ylpanH4wU0UFFg", totalTracks:369}, "8008215902");
        }
    }, [])

    return (
       <>
        {
            spotifyToken && deezerToken ?
            <div className="row">
                <div className="col">
                    <h4>Spotify playlists</h4>
                    <div>
                        {
                            spotifyPlaylists.map(p =>{
                                return(
                                    <p key={p.name} onClick={()=>{console.log(`${p.name} - ${p.tracks.total} - ${JSON.stringify(p)}`)}}>{p.name}</p>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col">
                    <h4>Deezer playlists</h4>
                    <div>
                        {
                            deezerPlaylists.map(p =>{
                                return(
                                    <p key={p.title}>{p.title}</p>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            :
            null
        }
       </>
    );
}

export default Playlists;
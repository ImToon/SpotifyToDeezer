import React, {useEffect, useState} from 'react';
import {SPOTIFY_TOKEN, DEEZER_TOKEN} from '../constants'
import {getDeezerPlaylists, getSpotifyPlaylists, transferSpotifyPlaylistToDeezerPlaylist} from '../services/api';
import {updateSubject} from '../services/util';

function Playlists() {
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
    const [deezerPlaylists, setDeezerPlaylists] = useState([]);
    const [nbSongsFound, setNbSongsFound] = useState(0);
    const [transferInfo, setTransferInfo] = useState(null);
    const [isTransfering, setIsTransfering] = useState(false);
    const [fromPlaylist, setFromPlaylist] = useState(null);
    const [toPlaylist, setToPlaylist] = useState(null);

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
            updateSubject.attach(setNbSongsFound);
            getPlaylists();
        }
    }, []);

    const startTransfer = async (playlist)=>{
        setIsTransfering(true);
        setFromPlaylist(playlist);
        const transferResult = await transferSpotifyPlaylistToDeezerPlaylist({id:playlist.id, totalTracks:playlist.tracks.total}, "8008215902");
        setIsTransfering(false);
        setTransferInfo(transferResult);
    }

    return (
       <>
        {
            spotifyToken && deezerToken ?
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div>
                            <h4>Spotify playlists</h4>
                            <select>
                                {
                                    spotifyPlaylists.map(p =>{
                                        return(
                                            <option key={p.name} value={p}>{p.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div>
                                {
                                    spotifyPlaylists.map(p =>{
                                        return(
                                            <p key={p.name} onClick={()=>{startTransfer(p)}}>{p.name}</p>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8.146 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.793 8 8.146 5.354a.5.5 0 0 1 0-.708z"/>
                            <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5H11a.5.5 0 0 1 0 1H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </div>
                    <div className="col">
                        <h4>Deezer playlists</h4>
                        <select>
                            {
                                deezerPlaylists.map(p =>{
                                    return(
                                        <option key={p.title} value={p}>{p.title}</option>
                                    )
                                })
                            }
                        </select>
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

                {
                    isTransfering?
                    <div className="progress">
                        <div style={{width: `${(nbSongsFound/fromPlaylist.tracks.total)*100}%`}} className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    :
                    null
                }

                {
                    transferInfo?
                    <div className="container">
                        <h4>These songs have not been found</h4>
                        <div>
                            {
                                transferInfo.notFoundSongs.map(s=>{
                                    return(
                                        <p key={s}>{s}</p>
                                    )
                                })
                            }
                        </div>

                        <h4>These songs have not been considered as duplicate</h4>
                        <div>
                            {
                                transferInfo.duplicatedObjects.map(o=>{
                                    return(
                                        <p key={o.song}>{o.song}</p>
                                    )
                                })
                            }
                        </div>

                        <div>
                            {
                                transferInfo.deezerResponse === true?
                                'The transfer succeeded'
                                :
                                'The transfer failed'
                            }
                        </div>
                    </div>
                    :
                    null
                }
                
            </div>
            :
            null
        }
       </>
    );
}

const styles = {

};

export default Playlists;
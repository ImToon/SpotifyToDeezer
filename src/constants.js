export const DeezerAppId = process.env.REACT_APP_DEEZER_APP_ID;
export const DeezerAppSecret = process.env.REACT_APP_DEEZER_APP_SECRET;
export const deezerCallback = 'http://localhost:3000/deezer';
export const DEEZER_TOKEN = "DEEZER_TOKEN";
export const DEEZER_URL=`https://connect.deezer.com/oauth/auth.php?app_id=${DeezerAppId}&redirect_uri=${deezerCallback}&perms=basic_access,email,manage_library`;

export const SpotifyAppId = process.env.REACT_APP_SPOTIFY_APP_ID
export const SpotifyAppSecret = process.env.REACT_APP_SPOTIFY_APP_SECRET;
export const spotifyCallback = 'http://localhost:3000/spotify';
export const SPOTIFY_TOKEN = "SPOTIFY_TOKEN";
export const SPOTIFY_URL = `https://accounts.spotify.com/authorize?client_id=${SpotifyAppId}&response_type=code&redirect_uri=${spotifyCallback}`
import React from 'react';
import DeezerLogin from './components/DeezerLogin';
import SpotifyLogin from './components/SpotifyLogin';
import Login from './components/Login';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
      <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/deezer">
          <DeezerLogin />
        </Route>
        <Route exact path="/spotify">
          <SpotifyLogin />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

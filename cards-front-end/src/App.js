import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';

import PitcherTable from './PitcherTable';

function App() {
  const teamId = 142
  const [pitchers, setPitchers] = useState([])
  const [games, setGames] = useState([])
  const [counts, setCounts] = useState({})
  const [pitchersOffRoster, setPitchersOffRoster] = useState([])
  useEffect(() => {
    axios.get(`/pitchers?teamId=${teamId}`).then(result => {
      console.log(result.data)
      setPitchers(result.data)
    })
    axios.get(`/lastgames?days=7&teamId=${teamId}`).then(result => {
      setGames(result.data)
      const params = new URLSearchParams()
      result.data.forEach(game => params.append('gameIds', game.gamePk))
      params.append('teamId', teamId)
      axios.get('/pitchcounts', { params: params }).then(result => {
        setCounts(result.data)
      })
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={10}>
            <p>BullCards</p>
            {pitchers.length && games.length && Object.keys(counts).length ?(
              <PitcherTable games={games} pitchers={pitchers} counts={counts}/>
            ): null}
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;

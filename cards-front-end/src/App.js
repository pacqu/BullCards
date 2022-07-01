import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {
  const [pitchers, setPitchers] = useState([])
  const [games, setGames] = useState([])
  const [counts, setCounts] = useState({})
  useEffect(() => {
    axios.get('/pitchers').then(result => {
      setPitchers(result.data)
    })
    axios.get('lastgames').then(result => {
      setGames(result.data)
      const gameIds = new URLSearchParams()
      result.data.forEach(game => gameIds.append('gameIds', game.gamePk))
      axios.get('/pitchcounts', {params: gameIds}).then(result => {
        console.log(result.data)
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
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Pitcher</TableCell>
                    {games.map(game => (
                      <TableCell>{game.officialDate}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pitchers.map((pitcher) => (
                  <TableRow
                    key={pitcher.person.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {pitcher.person.fullName}
                    </TableCell>
                    {Object.keys(counts).length ? games.map(game => {
                      const countsInGame = counts[game.gamePk]
                      const count = countsInGame.pitcherIds.includes(pitcher.person.id) ? countsInGame.pitcherCounts[pitcher.person.id].pitching.numberOfPitches : '-'
                      return <TableCell>{count}</TableCell>
                    }): null }
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;

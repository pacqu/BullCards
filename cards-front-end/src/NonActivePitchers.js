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

function NonActivePitchers({ pitchers, counts, games }) {
  const ids = pitchers.map(pitcher => pitcher.person.id)
  const nonActive = []
  const nonActiveIds = []
  Object.values(counts).forEach(game => {
    game.pitcherIds.forEach(id => {
      if (!(ids.includes(id)) && !(nonActiveIds.includes(id))) {
        nonActive.push(game.pitcherInfo[id.toString()])
        nonActiveIds.push(id)
      }
    })
  })
  console.log(nonActive)
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell colspan={games.length+1}>Not on Active Roster</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {nonActive.map((pitcher) => (
          <TableRow
            key={pitcher.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {pitcher.fullName}
            </TableCell>
            {Object.keys(counts).length && games.length ? games.map(game => {
              const countsInGame = counts[game.gamePk]
              const count = countsInGame.pitcherIds.includes(pitcher.id) ? countsInGame.pitcherCounts[pitcher.id].pitching.numberOfPitches : '-'
              return <TableCell>{count}</TableCell>
            }) : null}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default NonActivePitchers;

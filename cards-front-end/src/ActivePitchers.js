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

function ActivePitchers({ pitchers, counts, games }) {
  return (
    <>
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
            }) : null}
          </TableRow>
        ))}
      </TableBody>
    </>
  );

}
export default ActivePitchers;





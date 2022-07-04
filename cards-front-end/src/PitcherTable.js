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

import NonActivePitchers from './NonActivePitchers';
import ActivePitchers from './ActivePitchers';

function PitcherTable({ pitchers, counts, games }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <ActivePitchers pitchers={pitchers} counts={counts} games={games} />
        <NonActivePitchers pitchers={pitchers} counts={counts} games={games} />
      </Table>
    </TableContainer>
  );
}

export default PitcherTable;

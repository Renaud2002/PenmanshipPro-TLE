import React from 'react';
import './App.css';
import {Box} from '@mui/material';
import Write from './Component/Write';
import {io} from 'socket.io-client';

export const socket = io('https://penmanshipbackend.hop.sh/');

function App() {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Write />
    </Box>
  );
}

export default App;

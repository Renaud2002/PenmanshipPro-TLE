import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import {Box, Typography} from '@mui/material';
import Write from './Component/Write';
import {io} from 'socket.io-client';

export const socket = io('http://127.0.0.1:5000');

function App() {
  const [mode, setMode] = useState(0);
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {mode === 0 && <Write />}
    </Box>
  );
}

export default App;

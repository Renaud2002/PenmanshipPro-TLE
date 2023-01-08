import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import {Box, Typography} from '@mui/material';
import Write from './Component/Write';

function App() {
  const [mode, setMode] = useState(0);
  return (
    <Box
      width="100vw"
      height="100vh"
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

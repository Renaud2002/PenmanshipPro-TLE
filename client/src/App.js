import React, {useState} from 'react';
import './App.css';
import {Box, Button, Stack} from '@mui/material';
import Write from './Component/Write';
import {io} from 'socket.io-client';
import Test from './Component/Test';

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
      sx={{
        mt: 5,
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => {
            setMode(0);
          }}
        >
          Practice
        </Button>
        <Button
          onClick={() => {
            setMode(1);
          }}
        >
          Test
        </Button>
      </Stack>
      {mode === 0 ? <Write /> : <Test />}
    </Box>
  );
}

export default App;

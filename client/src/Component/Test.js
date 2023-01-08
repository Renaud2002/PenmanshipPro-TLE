import {
  Button,
  Stack,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  Grid,
} from '@mui/material';
import React, {useState, useEffect, useRef} from 'react';
import {socket} from '../App';
import {letters} from './constant';
import {useTimer} from 'react-timer-hook';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: 'rgba(38,38,38,1)',
      secondary: 'rgba(38,38,38,.75)',
    },
    fill: {
      active: 'rgba(0,10,32,.05)',
      hover: 'rgba(0,10,32,.1)',
    },
  },
  typography: {
    fontFamily: [
      'poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default function Test() {
  const [result, setResult] = useState(null);
  const [stored, setStored] = useState([]);
  const [selected, setSelected] = useState('None');
  const [game, setGame] = useState(false);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 6);
  const socketRef = useRef(socket);
  const {seconds, start, restart} = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => {
      setGame(false);
      ctx.current.fillStyle = 'white';
      ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
      handleSubmit();
      const time = new Date();
      time.setSeconds(time.getSeconds() + 6);
      restart(time, false);
    },
  });

  function handleSubmit() {
    console.log(socket);
    console.log(JSON.stringify(stored));
    socketRef.current.emit('multiple', JSON.stringify(stored));
  }

  // Socketio
  useEffect(() => {
    socket.on('multiple', (data) => {
      console.log(data);
      setResult(data);
    });
  }, []);

  let prevX = useRef(null);
  let prevY = useRef(null);
  let canvas = useRef(null);

  let draw = useRef(false);
  let ctx = useRef(null);
  useEffect(() => {
    canvas.current = document.getElementById('canvas');
    canvas.current.height = 224;
    canvas.current.width = 224;
    ctx.current = canvas.current.getContext('2d', {willReadFrequently: true});
    ctx.current.lineWidth = 20;
    // Line should be white
    ctx.current.strokeStyle = 'black';

    // Make the canvas background white
    ctx.current.fillStyle = 'white';
    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

    window.addEventListener('mousedown', (e) => (draw.current = true));
    window.addEventListener('mouseup', (e) => (draw.current = false));

    window.addEventListener('mousemove', function (e) {
      if (prevX.current == null || prevY.current == null || !draw.current) {
        prevX.current = e.clientX - canvas.current.getBoundingClientRect().left;
        prevY.current = e.clientY - canvas.current.getBoundingClientRect().top;
        return;
      }
      let mouseX = e.clientX - canvas.current.getBoundingClientRect().left;
      let mouseY = e.clientY - canvas.current.getBoundingClientRect().top;
      if (mouseX < 0 || mouseY < 0 || mouseX > 224 || mouseY > 224) return;
      ctx.current.beginPath();
      ctx.current.moveTo(prevX.current, prevY.current);
      ctx.current.lineTo(mouseX, mouseY);
      ctx.current.stroke();

      prevX.current = e.clientX - canvas.current.getBoundingClientRect().left;
      prevY.current = e.clientY - canvas.current.getBoundingClientRect().top;
    });
    return () => {
      window.removeEventListener('mousedown', (e) => (draw.current = true));
      window.removeEventListener('mouseup', (e) => (draw.current = false));

      window.removeEventListener('mousemove', function (e) {
        if (prevX.current == null || prevY.current == null || !draw.current) {
          prevX.current =
            e.clientX - canvas.current.getBoundingClientRect().left;
          prevY.current =
            e.clientY - canvas.current.getBoundingClientRect().top;
          return;
        }

        let mouseX = e.clientX - canvas.current.getBoundingClientRect().left;
        let mouseY = e.clientY - canvas.current.getBoundingClientRect().top;

        ctx.current.beginPath();
        ctx.current.moveTo(prevX.current, prevY.current);
        ctx.current.lineTo(mouseX, mouseY);
        ctx.current.stroke();

        prevX.current = e.clientX - canvas.current.getBoundingClientRect().left;
        prevY.current = e.clientY - canvas.current.getBoundingClientRect().top;
      });
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {!game && (
        <Stack height="50x" direction="column" spacing={2} alignItems="center">
          <Typography>Click the button below to start!</Typography>
          <Typography>
            You will have 6 seconds to write as many letter as you can.
          </Typography>
          <Button
            onClick={() => {
              ctx.current.fillStyle = 'white';
              ctx.current.fillRect(
                0,
                0,
                canvas.current.width,
                canvas.current.height,
              );
              setStored([]);
              // Set a random letter
              setSelected(
                letters[
                  Math.floor(Math.random() * Object.keys(letters).length)
                ],
              );
              setGame(true);
              start();
            }}
          >
            Start
          </Button>
        </Stack>
      )}
      {game && <Box height="50px"></Box>}
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{
          color: 'text.primary',
        }}
      >
        <Typography variant="h4">Time left: {seconds}</Typography>
        <Typography variant="h4">Letter: {selected}</Typography>
        <Button
          disabled={!game}
          sx={{
            borderRadius: 2,
            color: 'rgb(255, 255, 255)',
            backgroundColor: 'rgba(38, 38, 38, 1)',
            boxShadow:
              '0px 1px 3px rgba(0,0,0,.04),0px 4px 12px rgba(0,0,0,.08)',
            '&:hover': {
              color: 'rgb(255, 255, 255)',
              backgroundColor: 'rgba(38, 38, 38, 1)',
              boxShadow:
                '0px 1px 3px rgba(0,0,0,.04),0px 4px 12px rgba(0,0,0,.08)',
            },
          }}
          onClick={() => {
            ctx.current.fillStyle = 'white';
            ctx.current.fillRect(
              0,
              0,
              canvas.current.width,
              canvas.current.height,
            );
          }}
        >
          Clear
        </Button>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'text.primary',
            boxShadow: 1,
          }}
        >
          <canvas id="canvas" />
        </Box>

        <Button
          disabled={!game}
          sx={{
            borderRadius: 2,
            color: '#fff',
            backgroundColor: 'rgb(45, 181, 93)',
            '&:hover': {
              backgroundColor: 'rgba(38,154,79, 1)',
              color: '#fff',
            },
          }}
          onClick={() => {
            const ctx_data = ctx.current.getImageData(0, 0, 224, 224, {
              colorSpace: 'srgb',
            });

            const nums = ctx_data.data;
            let array = [];
            let pixels = [];
            for (let i = 0; i < nums.length; i += 4) {
              let avg = (nums[i] + nums[i + 1] + nums[i + 2]) / 3.0;
              pixels.push([avg, avg, avg]);
              if (pixels.length === 224) {
                array.push(pixels);
                pixels = [];
              }
            }
            ctx.current.fillStyle = 'white';
            ctx.current.fillRect(
              0,
              0,
              canvas.current.width,
              canvas.current.height,
            );
            setStored([...stored, [selected, array]]);
            setSelected(
              letters[Math.floor(Math.random() * Object.keys(letters).length)],
            );
          }}
        >
          Submit
        </Button>
        {result && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Results</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Expected</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Predicted</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">Accuracy</Typography>
            </Grid>
            {stored.map((item, index) =>
              item.map((each, i) => (
                <Grid item xs={4}>
                  <Typography key={index + i} variant="h6">
                    {each}
                  </Typography>
                </Grid>
              )),
            )}
          </Grid>
        )}
      </Stack>
    </ThemeProvider>
  );
}

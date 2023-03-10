import {
  Button,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import React, {useState, useEffect, useRef} from 'react';
import {socket} from '../App';
import {letters} from './constant';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 50,
    },
  },
};

let previous = null;
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

export default function Write() {
  const [selected, setSelected] = useState('A');
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setResult(null);
    setSelected(event.target.value);
  };

  // Socketio
  useEffect(() => {
    socket.on('prediction', (data) => {
      let temp = letters[data[0]];
      setResult({
        result: temp,
        accuracy: data[1],
      });
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
    ctx.current = canvas.current.getContext('2d');
    ctx.current.lineWidth = 20;
    // Line should be white
    ctx.current.strokeStyle = 'black';

    // Make the canvas background white
    ctx.current.fillStyle = 'white';
    ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

    window.addEventListener('mousedown', (e) => {
      draw.current = true;
    });
    window.addEventListener('mouseup', (e) => (draw.current = false));

    // Touch events
    canvas.current.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        draw.current = true;
      },
      {passive: false},
    );
    canvas.current.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        draw.current = false;
        prevX.current = null;
        prevY.current = null;
      },
      {passive: false},
    );

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
    window.addEventListener('touchmove', function (e) {
      if (prevX.current == null || prevY.current == null || !draw.current) {
        prevX.current = e.clientX - canvas.current.getBoundingClientRect().left;
        prevY.current = e.clientY - canvas.current.getBoundingClientRect().top;
        return;
      }
      let mouseX =
        e.changedTouches[0].clientX -
        canvas.current.getBoundingClientRect().left;
      let mouseY =
        e.changedTouches[0].clientY -
        canvas.current.getBoundingClientRect().top;
      if (mouseX < 0 || mouseY < 0 || mouseX > 224 || mouseY > 224) return;
      ctx.current.beginPath();
      ctx.current.moveTo(prevX.current, prevY.current);
      ctx.current.lineTo(mouseX, mouseY);
      ctx.current.stroke();

      prevX.current =
        e.changedTouches[0].clientX -
        canvas.current.getBoundingClientRect().left;
      prevY.current =
        e.changedTouches[0].clientY -
        canvas.current.getBoundingClientRect().top;
    });
    return () => {
      window.removeEventListener('mousedown', (e) => (draw.current = true));
      window.removeEventListener('mouseup', (e) => (draw.current = false));
      // Touch events
      canvas.current.removeEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          draw.current = true;
        },
        {passive: false},
      );
      canvas.current.removeEventListener(
        'touchend',
        (e) => {
          e.preventDefault();
          draw.current = false;
          prevX.current = null;
          prevY.current = null;
        },
        {passive: false},
      );

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
      window.removeEventListener('touchmove', function (e) {
        if (prevX.current == null || prevY.current == null || !draw.current) {
          prevX.current =
            e.clientX - canvas.current.getBoundingClientRect().left;
          prevY.current =
            e.clientY - canvas.current.getBoundingClientRect().top;
          return;
        }
        let mouseX =
          e.changedTouches[0].clientX -
          canvas.current.getBoundingClientRect().left;
        let mouseY =
          e.changedTouches[0].clientY -
          canvas.current.getBoundingClientRect().top;
        if (mouseX < 0 || mouseY < 0 || mouseX > 224 || mouseY > 224) return;
        ctx.current.beginPath();
        ctx.current.moveTo(prevX.current, prevY.current);
        ctx.current.lineTo(mouseX, mouseY);
        ctx.current.stroke();

        prevX.current =
          e.changedTouches[0].clientX -
          canvas.current.getBoundingClientRect().left;
        prevY.current =
          e.changedTouches[0].clientY -
          canvas.current.getBoundingClientRect().top;
      });
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{
          mt: 5,
          color: 'text.primary',
        }}
      >
        <FormControl>
          <InputLabel>Letter</InputLabel>
          <Select
            sx={{
              borderRadius: 2,
              color: 'text.primary',
              backgroundColor: 'fill.active',
              '&:clicked': {},
              '&:focus': {
                backgroundColor: 'fill.hover',
                color: 'text.primary',
              },
              '&:hover': {
                backgroundColor: 'fill.hover',
                color: 'text.primary',
              },
            }}
            value={selected}
            label="Letter"
            onChange={handleChange}
            MenuProps={MenuProps}
          >
            {Object.keys(letters).map((letter) => (
              <MenuItem key={letter} value={letters[letter]}>
                {letters[letter]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
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
            prevX.current = null;
            prevY.current = null;
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
            if (previous === null) {
              previous = array.toString();
            } else {
              console.log(previous === array.toString());
              previous = array.toString();
            }
            socket.emit('predict', JSON.stringify(array));
          }}
        >
          Submit
        </Button>
        {result && (
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Typography
              align="center"
              sx={{
                fontSize: 18,
              }}
            >
              {selected === result.result
                ? 'You have written the correct letter: ' + result.result
                : 'You have written the wrong letter, you have written a: ' +
                  result.result}
            </Typography>
            <Typography
              align="center"
              sx={{
                fontSize: 18,
              }}
            >
              {selected === result.result
                ? 'Your accuracy is: ' +
                  (result.accuracy * 100).toFixed(2) +
                  '%'
                : 'Your accuracy is: ' +
                  (result.accuracy * 100).toFixed(2) +
                  '%'}
            </Typography>
          </Stack>
        )}
      </Stack>
    </ThemeProvider>
  );
}

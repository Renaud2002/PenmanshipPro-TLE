import {
  Button,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
  Box,
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

export default function Write() {
  const [selected, setSelected] = useState('A');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

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
    ctx.current.lineWidth = 5;

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
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <Button
        onClick={() => {
          ctx.current.clearRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height,
          );
        }}
      >
        Clear
      </Button>

      <FormControl fullWidth>
        <InputLabel>Letter</InputLabel>

        <Select
          value={selected}
          label="Letter"
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {letters.map((letter, index) => (
            <MenuItem key={index} value={letter}>
              {letter}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          border: '1px solid black',
        }}
      >
        <canvas id="canvas" />
      </Box>
      <Button
        onClick={() => {
          const ctx_data = ctx.current.getImageData(0, 0, 224, 224, {
            colorSpace: 'srgb',
          });
          const nums = ctx_data.data;
          let array = [];
          let pixels = [];
          for (let i = 0; i < nums.length; i += 4) {
            let avg = (nums[i] + nums[i + 1] + nums[i + 2]) / 3;
            pixels.push([avg, avg, avg]);
            if (pixels.length === 224) {
              array.push(pixels);
              pixels = [];
            }
          }
          if (previous === null) {
            previous = array.toString();
          } else {
            console.log(previous.toString() === array.toString());
            previous = array.toString();
          }
          socket.emit('predict', array);
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}

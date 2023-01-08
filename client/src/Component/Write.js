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

export default function Write() {
  const [selected, setSelected] = useState('A');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  let prevX = useRef(null);
  let prevY = useRef(null);

  let draw = useRef(false);
  let ctx = useRef(null);
  useEffect(() => {
    let canvas = document.getElementById('canvas');
    canvas.height = 224;
    canvas.width = 224;
    ctx.current = canvas.getContext('2d');
    ctx.current.lineWidth = 5;

    window.addEventListener('mousedown', (e) => (draw.current = true));
    window.addEventListener('mouseup', (e) => (draw.current = false));

    window.addEventListener('mousemove', function (e) {
      if (prevX.current == null || prevY.current == null || !draw.current) {
        prevX.current = e.clientX - canvas.getBoundingClientRect().left;
        prevY.current = e.clientY - canvas.getBoundingClientRect().top;
        return;
      }
      let mouseX = e.clientX - canvas.getBoundingClientRect().left;
      let mouseY = e.clientY - canvas.getBoundingClientRect().top;
      ctx.current.beginPath();
      ctx.current.moveTo(prevX.current, prevY.current);
      ctx.current.lineTo(mouseX, mouseY);
      ctx.current.stroke();

      prevX.current = e.clientX - canvas.getBoundingClientRect().left;
      prevY.current = e.clientY - canvas.getBoundingClientRect().top;
    });
    return () => {
      window.removeEventListener('mousedown', (e) => (draw.current = true));
      window.removeEventListener('mouseup', (e) => (draw.current = false));

      window.removeEventListener('mousemove', function (e) {
        if (prevX.current == null || prevY.current == null || !draw.current) {
          prevX.current = e.clientX - canvas.getBoundingClientRect().left;
          prevY.current = e.clientY - canvas.getBoundingClientRect().top;
          return;
        }

        let mouseX = e.clientX - canvas.getBoundingClientRect().left;
        let mouseY = e.clientY - canvas.getBoundingClientRect().top;
        ctx.current.beginPath();
        ctx.current.moveTo(prevX.current, prevY.current);
        ctx.current.lineTo(mouseX, mouseY);
        ctx.current.stroke();

        prevX.current = e.clientX - canvas.getBoundingClientRect().left;
        prevY.current = e.clientY - canvas.getBoundingClientRect().top;
      });
    };
  }, []);

  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
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
      <Button>Submit</Button>
    </Stack>
  );
}

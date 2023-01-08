import {
  Button,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
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
        prevX.current = e.clientX;
        prevY.current = e.clientY;
        return;
      }

      console.log(prevX.current);
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      ctx.current.beginPath();
      ctx.current.moveTo(prevX.current, prevY.current);
      ctx.current.lineTo(mouseX.current, mouseY.current);
      ctx.current.stroke();

      prevX.current = e.clientX;
      prevY.current = e.clientY;
    });
    return () => {
      window.removeEventListener('mousedown', (e) => (draw.current = true));
      window.removeEventListener('mouseup', (e) => (draw.current = false));

      window.removeEventListener('mousemove', function (e) {
        if (prevX.current == null || prevY.current == null || !draw.current) {
          prevX.current = e.clientX;
          prevY.current = e.clientY;
          return;
        }

        let mouseX = e.clientX;
        let mouseY = e.clientY;
        ctx.current.beginPath();
        ctx.current.moveTo(prevX.current, prevY.current);
        ctx.current.lineTo(mouseX.current, mouseY.current);
        ctx.current.stroke();

        prevX.current = e.clientX;
        prevY.current = e.clientY;
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
      <canvas id="canvas" />
      <Button>Submit</Button>
    </Stack>
  );
}

import {
  Button,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
} from '@mui/material';
import React, {useState} from 'react';
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
          {letters.map((letter) => (
            <MenuItem value={letter}>{letter}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button>Submit</Button>
    </Stack>
  );
}

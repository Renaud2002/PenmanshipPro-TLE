import React from 'react';
import {Button, Stack, Typography} from '@mui/material';

export default function Result(props) {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
      <Typography>Result:</Typography>
      <Typography>
        {props.selected === props.result
          ? 'Your accuracy is: ' + props.accuracy + '%'
          : 'You have written the wrong letter, you have written a: ' +
            props.result}
      </Typography>
      <Button>Return</Button>
    </Stack>
  );
}

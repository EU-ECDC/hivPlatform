import React from 'react';
import Button from '@mui/material/Button';

const Btn = (props) => {
  const { children, ...other } = props;

  return (
    <Button
      variant='contained'
      color='primary'
      component='span'
      sx={{
        color: 'white'
      }}
      {...other}
    >
      {children}
    </Button>
  );
};

export default Btn;

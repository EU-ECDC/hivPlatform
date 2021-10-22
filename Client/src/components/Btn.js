import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

const useStyles = makeStyles(() => ({
  root: {
    color: 'white'
  }
}));

const Btn = (props) => {
  const classes = useStyles();
  const { children, ...other } = props;

  return (
    <Button variant='contained' color='primary' component='span' className={classes.root} {...other}>
      {children}
    </Button>
  );
};

export default Btn;

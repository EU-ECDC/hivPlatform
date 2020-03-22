import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
    color: 'white'
  }
}));

const Btn = (props) => {
  const classes = useStyles();

  return (
    <Button variant='contained' color='primary' component='span' className={classes.root}>
      {props.children}
    </Button>
  )
};

export default Btn;

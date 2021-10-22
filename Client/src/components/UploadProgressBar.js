import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import LinearProgress from '@mui/material/LinearProgress';
import IsNull from '../utilities/IsNull';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10,
    marginBottom: 10,
    height: 10,
  }
}));

const UploadProgressBar = (props) => {
  const { progress } = props;
  if (IsNull(progress)) return null;

  const classes = useStyles();

  return <LinearProgress
    variant='determinate'
    value={progress * 100}
    color='secondary'
    className={classes.root}
  />
};

export default UploadProgressBar;

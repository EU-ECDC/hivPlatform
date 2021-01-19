import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
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

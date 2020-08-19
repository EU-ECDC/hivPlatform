import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const UploadProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress variant='determinate' value={progress * 100} color='secondary' />
};

export default UploadProgressBar;

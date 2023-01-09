import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import IsNull from '../utilities/IsNull';

const UploadProgressBar = ({progress}) => {
  if (IsNull(progress)) return null;

  return <LinearProgress
    variant='determinate'
    value={progress * 100}
    color='secondary'
    sx={{
      marginTop: '10px',
      marginBottom: '10px',
      height: '5px',
    }}
  />
};

export default UploadProgressBar;

import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import IsNull from '../utilities/IsNull';

const UploadProgressBar = (props) => {
  const { progress } = props;
  if (IsNull(progress)) return null;

  return <LinearProgress
    variant='determinate'
    value={progress * 100}
    color='secondary'
    sx={{
      root: {
        marginTop: '10px',
        marginBottom: '10px',
        height: '10px',
      }
    }}
  />
};

export default UploadProgressBar;

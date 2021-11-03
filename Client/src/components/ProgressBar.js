import React from 'react';
import { observer } from 'mobx-react';
import LinearProgress from '@mui/material/LinearProgress';
import IsNull from '../utilities/IsNull';

const ProgressBar = (props) => {
  const { progress } = props;
  if (IsNull(progress) | !progress) return null;

  return <LinearProgress
    color='secondary'
    sx={{
      marginTop: '10px',
      marginBottom: '10px',
      height: '5px',
    }}
  />
};

export default observer(ProgressBar);

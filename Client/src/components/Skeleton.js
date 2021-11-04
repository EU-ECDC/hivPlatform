import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const Skel = () => {
  return (
    <React.Fragment>
      <Skeleton variant="text" width={500} animation='wave'/>
      <Skeleton variant="circular" width={40} height={40} animation={false}/>
      <Skeleton variant="rectangular" width={500} height={300} animation={false}/>
    </React.Fragment>
  );
};

export default Skel;

import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const Skel = () => {
  return (
    <React.Fragment>
      <Skeleton variant="text" width={500} animation='wave'/>
      <Skeleton variant="circle" width={40} height={40} animation={false}/>
      <Skeleton variant="rect" width={500} height={300} animation={false}/>
    </React.Fragment>
  )
};

export default Skel;

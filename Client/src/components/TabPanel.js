import React from 'react';
import Typography from '@mui/material/Typography';

const TabPanel = props => {
  const { children, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      style={{ flexGrow: 1 }}
      {...other}
    >
      {children}
    </Typography>
  );
};

export default TabPanel;

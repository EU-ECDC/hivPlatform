import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const TabPanel = props => {
  const { children, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      style={{ flexGrow: 1 }}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
};

export default TabPanel;

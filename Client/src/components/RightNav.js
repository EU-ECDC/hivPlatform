import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const RightNav = (props) => {
  const { open, onClose } = props;

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box width={300} p={2}>
        <Typography variant='h6'>
          Settings
        </Typography>
      </Box>
    </Drawer>
  )
}

export default RightNav;

import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const RightNav = (props) => {
  const { open, onClose } = props;

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box width={300} p={2}>
        <Typography variant='h6'>Options:</Typography>
        <ul>
          <li><Link href="#">Save state</Link></li>
          <li><Link href="#">Load state</Link></li>
          <li><Link href="#">Set seed</Link></li>
          <li><Link href="#">Open new instance in separate tab</Link></li>
        </ul>
      </Box>
    </Drawer>
  )
}

export default RightNav;

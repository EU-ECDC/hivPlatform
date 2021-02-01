import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const RightNav = (props) => {
  const { appMgr, open, onClose } = props;

  const downloadLinkIds = ['downState'];

  React.useEffect(
    () => {
      appMgr.unbindShiny(downloadLinkIds);
      appMgr.bindShiny();

      return () => appMgr.unbindShiny(downloadLinkIds);
    }
  );

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box width={300} p={2}>
        <Typography variant='h6'>Application</Typography>
        <Link href='#' id='downState' className='shiny-download-link'>Save state</Link>
        <Link href='#' style={{ marginLeft: 10 }}>Load state</Link>
        {/* <Typography variant='h6'>Options:</Typography>
        <ul>
          <li><Link href="#">Save state</Link></li>
          <li><Link href="#">Load state</Link></li>
          <li><Link href="#">Set seed</Link></li>
          <li><Link href="#">Open new instance in separate tab</Link></li>
        </ul> */}
      </Box>
    </Drawer>
  )
}

export default RightNav;

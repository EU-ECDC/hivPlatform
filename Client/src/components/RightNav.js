import React from 'react';
import { observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const RightNav = (props) => {
  const { appMgr, open, onClose } = props;

  const [seed, setSeed] = React.useState(null);

  const handleSaveStateBtnClick = () => appMgr.saveState();

  const handleSeedChange = e => setSeed(parseInt(e.target.value));

  const handleSeedApply = () => appMgr.btnClicked('seed', seed);

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box width={300} p={2}>
        <Typography variant='h6'>Application</Typography>
        <ul>
          <li>
            <Link
              href='#'
              id='saveState'
              variant='button'
              onClick={handleSaveStateBtnClick}
              // style={{ pointerEvents: 'none' }}
            >
              Save state [DISABLED]
            </Link>
          </li>
          <li>
            <Link
              href='#'
              variant='button'
              style={{ pointerEvents: 'none' }
            }>
              Load state [DISABLED]
            </Link>
          </li>
          <li>
            <Link
              href='./'
              target='_blank'
              variant='button'
            >
              Open another instance
            </Link>
          </li>
        </ul>

        <Typography variant='h6'>Documentation</Typography>
        <ul>
          <li>
            <Link
              href='./www/docs/HIVPlatform_2.0.0_manual.pdf'
              target='_blank'
              variant='button'
            >
              Open manual [PDF]
            </Link>
          </li>
        </ul>

        <Typography variant='h6'>Options</Typography>
        <TextField
          label='Random seed'
          helperText='Give empty value to remove fixed seed'
          variant='filled'
          type='number'
          fullWidth
          defaultValue={appMgr.seedText}
          onChange={handleSeedChange}
        />
        <Button color='primary' size='small' onClick={handleSeedApply}>Apply</Button>
      </Box>
    </Drawer>
  )
}

export default observer(RightNav);

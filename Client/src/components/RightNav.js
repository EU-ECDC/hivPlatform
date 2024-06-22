import React from 'react';
import { observer } from 'mobx-react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import UploadProgressBar from './UploadProgressBar';

const RightNav = (props) => {
  const { appMgr, open, onClose } = props;

  const [seed, setSeed] = React.useState(null);

  const handleSaveStateBtnClick = () => appMgr.saveState();

  const handleLoadStateBtnClick = e => appMgr.loadState(e.target);

  const handleSeedChange = e => setSeed(parseInt(e.target.value));

  const handleSeedApply = () => appMgr.btnClicked('seed', seed);

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box width={300} p={2}>
        <List dense>
          <ListSubheader>
            <Typography variant='button'>Application</Typography>
          </ListSubheader>
          <ListItem>
            <Button
              color='primary'
              size='small'
              component='label'
              onClick={handleSaveStateBtnClick}
            >
              Save state
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color='primary'
              size='small'
              component='label'
            >
              Load state
              <input
                hidden
                type='file'
                accept='.rds'
                onChange={handleLoadStateBtnClick}
                id='loadStateBtn'
              />
            </Button>
          </ListItem>
          <UploadProgressBar progress={appMgr.loadStateProgress} />
          <ListItem>
            <Button
              color='primary'
              size='small'
              component='a'
              href='./'
              target='_blank'
            >
              Open another instance
            </Button>
          </ListItem>
        </List>
        <ListSubheader>
          <Typography variant='button'>Documentation</Typography>
        </ListSubheader>
        <ListItem>
          <Button
            color='primary'
            size='small'
            component='a'
            href='./www/docs/HIVPlatform_3.0_manual.pdf'
            target='_blank'
          >
            Open manual pdf
          </Button>
        </ListItem>
        <ListSubheader>
          <Typography variant='button'>Options</Typography>
        </ListSubheader>
        <ListItem>
          <TextField
            label='Seed value'
            helperText='Leave empty value to enable random seed'
            type='number'
            fullWidth
            defaultValue={appMgr.seedText}
            onChange={handleSeedChange}
          />
        </ListItem>
        <ListItem>
          <Button color='primary' size='small' onClick={handleSeedApply}>Apply</Button>
        </ListItem>
      </Box>
    </Drawer>
  )
}

export default observer(RightNav);

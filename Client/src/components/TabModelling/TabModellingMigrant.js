import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TabPanel from '../TabPanel';

const TabModellingMigrant = ({ appMgr }) => {

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 1);
  const handleMigrConnFlagChange = e => appMgr.modelMgr.setMigrConnFlag(e.target.value === 'true');

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Migrant connection
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <RadioGroup
            row
            value={appMgr.modelMgr.migrConnFlag}
            onChange={handleMigrConnFlagChange}
          >
            <FormControlLabel value={true} control={<Radio color='primary' />} label='Yes'/>
            <FormControlLabel value={false} control={<Radio color='primary' />} label='No'/>
          </RadioGroup>
          <Typography variant='body2' color='textSecondary'>
            Enable alternative HIV modelling processing with migrant status information used.
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Paper sx={{ padding: '10px' }}>
            <Typography variant='overline'>Status</Typography>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingMigrant);

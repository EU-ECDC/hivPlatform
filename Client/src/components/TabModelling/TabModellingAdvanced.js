import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TabPanel from '../TabPanel';
import AdvancedParameters from './AdvancedParameters';

const TabModellingAdvanced = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 3);

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
            Advanced paramaters
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={10}>
          <AdvancedParameters {...props}/>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingAdvanced;

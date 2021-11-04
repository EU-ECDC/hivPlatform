import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TabPanel from '../TabPanel';
import TabAdjustmentsMI from './TabAdjustmentsInputsMI';
import TabAdjustmentsRD from './TabAdjustmentsInputsRD';

const TabAdjustmentsInputs = (props) => {
  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(3, 1);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.adjustMgr.adjustmentSelected}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Case-based data adjustments parameters
          </Typography>
        </Grid>
        <TabAdjustmentsMI {...props} />
        <TabAdjustmentsRD {...props} />
      </Grid>
    </TabPanel>
  );
};

export default observer(TabAdjustmentsInputs);

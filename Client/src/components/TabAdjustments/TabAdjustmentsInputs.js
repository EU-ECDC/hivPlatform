import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TabPanel from '../TabPanel';
import TabAdjustmentsMI from './TabAdjustmentsInputsMI';
import TabAdjustmentsRD from './TabAdjustmentsInputsRD';

const TabAdjustmentsInputs = (props) => {
  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <TabAdjustmentsMI {...props} />
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <TabAdjustmentsRD {...props} />
      </Grid>
    </TabPanel>
  );
};

export default observer(TabAdjustmentsInputs);

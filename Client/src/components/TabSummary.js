import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TabPanel from './TabPanel';
import TabSummaryDiagYear from './TabSummaryDiagYear';
import TabSummaryNotifQuarter from './TabSummaryNotifQuarter';
import TabSummaryMissingness from './TabSummaryMissingness';
import TabSummaryReportingDelays from './TabSummaryReportingDelays';

const TabSummary = (props) => {

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <TabSummaryDiagYear {...props} />
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <TabSummaryNotifQuarter {...props} />
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <TabSummaryMissingness {...props} />
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <TabSummaryReportingDelays {...props} />
      </Grid>
    </TabPanel>
  )
};

export default observer(TabSummary);

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TabPanel from '../TabPanel';
import Btn from '../Btn';

const AdjustmentsRunProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress color='secondary' />
};

const TabAdjustmentsRun = props => {
  const { appManager } = props;

  const handleRunAdjustBtnClick = () => {
    appManager.adjustMgr.runAdjustments();
  }

  const handleCancelAdjustBtnClick = () => {
    appManager.adjustMgr.cancelAdjustments();
  }

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Btn
            onClick={handleRunAdjustBtnClick}
            disabled={!appManager.adjustMgr.adjustmentSelected || appManager.adjustmentsRunInProgress}
          >
            <DirectionsRunIcon />&nbsp;Run adjustments
          </Btn>
          <Button
            onClick={handleCancelAdjustBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appManager.adjustmentsRunInProgress}
          >
            Cancel
          </Button>
          <AdjustmentsRunProgressBar progress={appManager.adjustmentsRunProgress} />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre>
              {appManager.adjustmentsRunLog}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabAdjustmentsRun);

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import IsNull from '../../utilities/IsNull';
import ProgressBar from '../ProgressBar';

const TabAdjustmentsRun = props => {
  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);

  const [tabId, setTabId] = React.useState(0);

  const handleTabChange = (e, tabId) => setTabId(tabId);

  const handleRunAdjustBtnClick = () => appMgr.adjustMgr.runAdjustments();

  const handleCancelAdjustBtnClick = () => appMgr.adjustMgr.cancelAdjustments();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.uiStateMgr.reportsPageEnabled}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Case-based data adjustments run
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Btn
            onClick={handleRunAdjustBtnClick}
            disabled={
              !appMgr.adjustMgr.adjustmentSelected ||
              appMgr.adjustMgr.adjustmentsRunInProgress
            }
          >
            <DirectionsRunIcon />&nbsp;Run adjustments
          </Btn>
          <Button
            onClick={handleCancelAdjustBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.adjustMgr.adjustmentsRunInProgress}
          >
            Cancel
          </Button>
          <ProgressBar progress={appMgr.adjustMgr.adjustmentsRunProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Tabs
              value={tabId}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                label='Run log'
                disabled={IsNull(appMgr.adjustMgr.adjustmentsRunLog)}
              />
              <Tab
                label='Diagnostics'
                disabled={IsNull(appMgr.adjustMgr.adjustmentsReport)}
              />
            </Tabs>

            {tabId === 0 && <React.Fragment>
              <pre
                dangerouslySetInnerHTML={{ __html: appMgr.adjustMgr.adjustmentsRunLog }}
                style={{ overflowX: 'auto', fontSize: '0.75rem' }}
              />
            </React.Fragment>}
            {tabId === 1 && <React.Fragment>
              <div
                dangerouslySetInnerHTML={{ __html: appMgr.adjustMgr.adjustmentsReport }}
                style={{ overflowX: 'auto' }}
              />
            </React.Fragment>}
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabAdjustmentsRun);

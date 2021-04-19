import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TabPanel from '../TabPanel';
import TabModellingOutputsGOF from './TabModellingOuputsGOF';
import TabModellingOutputsTables from './TabModellingOutputsTables';
import TabModellingOutputsGraphs from './TabModellingOutputsGraphs';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const TabModellingOutputs = props => {
  const { appMgr } = props;

  const [tabId, setTabId] = React.useState(0);

  const handleNextpageBtnClick = () => appMgr.uiStateMgr.setActivePageId(5);

  const handleTabChange = (e, tabId) => setTabId(tabId);

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
            HIV Modelling results
          </Typography>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Tabs
              value={tabId}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab label='Goodness of fit' />
              <Tab label='Tables' />
              <Tab label='Graphs'/>
            </Tabs>
            {tabId === 0 && <TabModellingOutputsGOF appMgr={appMgr} />}
            {tabId === 1 && <TabModellingOutputsTables appMgr={appMgr} />}
            {tabId === 2 && <TabModellingOutputsGraphs appMgr={appMgr} />}
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingOutputs);

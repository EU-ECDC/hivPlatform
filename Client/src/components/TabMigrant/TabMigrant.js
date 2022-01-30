import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import ProgressBar from '../ProgressBar';
import MigrChart from '../Charts/MigrChart';
import IsNull from '../../utilities/IsNull';
import Title from '../Title';
import MissStat from './MissStat';
import YODDistr from './YODDistr';
import TableDistr from './TableDistr';
import PropCharts from './PropCharts';

const TabMigrant = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);

  const [tabId, setTabId] = React.useState(0);

  const handleTabChange = (e, tabId) => setTabId(tabId);

  const handleRunBtnClick = () => appMgr.migrMgr.run();

  const handleCancelBtnClick = () => appMgr.migrMgr.cancel();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              disabled={true}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Migrant modelling run
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Btn
            onClick={handleRunBtnClick}
            disabled={appMgr.migrMgr.runInProgress}
          >
            <DirectionsRunIcon />&nbsp;Run migration
          </Btn>
          <Button
            onClick={handleCancelBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.migrMgr.runInProgress}
          >
            Cancel
          </Button>
          <ProgressBar progress={appMgr.migrMgr.runProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Tabs
              value={tabId}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab label='Run log' />
              <Tab label='Diagnostics' disabled={IsNull(appMgr.migrMgr.inputStats)}/>
            </Tabs>
            {tabId === 0 && <React.Fragment>
              <pre
                dangerouslySetInnerHTML={{ __html: appMgr.migrMgr.runLog }}
                style={{ overflowX: 'auto', fontSize: '0.75rem' }}
              />
            </React.Fragment>}
            {
              tabId === 1 &&
              <div style={{ maxWidth: 1000 }}>
                <h3>1. Overview</h3>
                <p>
                  Estimates of the time of infection require the following variables: Sex,
                  transmission category, Region of Origin, AIDS diagnosis. CD4 count and VL are used
                  if available. In addition, the time of infection must be compared to the arrival
                  time and the estimation based on the cases for which both Year of Arrival and Year
                  of Diagnosis are known.
                </p>

                <p>
                  It is possible to run the migration estimation on the original dataset, but it is
                  recommended to use the imputation first.
                </p>

                <p>The estimation is performed for adults only.</p>
                <MissStat missingness={appMgr.migrMgr.missingness} />

                <h3>2. Description of data used in estimation</h3>

                <Title>Figure 1. Average number of cases by Year of Arrival and Region For Migration Module</Title>
                <MigrChart data={appMgr.migrMgr.regionDistr} />
                <YODDistr migrMgr={appMgr.migrMgr} />

                <h3>3. Estimates of the proportion of the migrants infected prior and post arrival</h3>
                <TableDistr migrMgr={appMgr.migrMgr}/>
                <PropCharts migrMgr={appMgr.migrMgr} />
              </div>
            }
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabMigrant);

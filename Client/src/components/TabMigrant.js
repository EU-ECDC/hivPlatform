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
import TabPanel from './TabPanel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Btn from './Btn';
import HIVChart from './Charts/HIVChart';
import IsNull from '../utilities/IsNull';
import ProgressBar from './ProgressBar';

const TabMigrant = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);

  const [tabId, setTabId] = React.useState(2);

  const handleTabChange = (e, tabId) => setTabId(tabId);

  const handleRunBtnClick = () => appMgr.migrMgr.run();

  const handleCancelBtnClick = () => appMgr.migrMgr.cancel();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
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
              <Tab
                label='Run log'
                disabled={IsNull(appMgr.migrMgr.runLog) }
              />
              <Tab
                label='Diagnostics'
                disabled={IsNull(appMgr.migrMgr.report) }
              />
              <Tab
                label='Diagnostics (NEW)'
              />
            </Tabs>
            {tabId === 0 && <React.Fragment>
              <pre
                dangerouslySetInnerHTML={{ __html: appMgr.migrMgr.runLog }}
                style={{ overflowX: 'auto', fontSize: '0.75rem' }}
              />
            </React.Fragment>}
            {tabId === 1 && <React.Fragment>
              <div
                dangerouslySetInnerHTML={{ __html: appMgr.migrMgr.report }}
                style={{ overflowX: 'auto' }}
              />
            </React.Fragment>}
            {tabId === 2 && <div style={{maxWidth: 800}}>
              <h3>1. Overview</h3>

              <p>CAUTION:</p>

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

              <p>Cases excluded due to missing values:</p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width='400px'>Missing variable</TableCell>
                    <TableCell>Number of excluded cases</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>Missing date of arrival</TableCell>
                    <TableCell>3526</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Transmission is not of type "MSM", "ICU", or "HETERO"</TableCell>
                    <TableCell>3526</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Missing full region of origin</TableCell>
                    <TableCell>10</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell style={{fontWeight: 'bold'}}>Total excluded</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>6476</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell style={{fontWeight: 'bold'}}>Total used in estimation</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>942</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3>2. Description of data used in estimation</h3>

              <p>Table 1. Number of cases by Region of Origin and Year of Arrival</p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2}>Year of arrival</TableCell>
                    <TableCell colSpan={3}>
                      Region of origin
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Europe</TableCell>
                    <TableCell>Africa</TableCell>
                    <TableCell>Asia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>2000</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>15</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2001</TableCell>
                    <TableCell>87</TableCell>
                    <TableCell>23</TableCell>
                    <TableCell>54</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2002</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>5</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2003</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>23</TableCell>
                    <TableCell>76</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <p>Table 2. Number of cases by the Year of Arrival and Year of Diagnosis</p>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Region of origin</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value='Europe'
                >
                  <MenuItem value='Europe' dense>Europe</MenuItem>
                  <MenuItem value='Africa' dense>Africa</MenuItem>
                  <MenuItem value='Asia' dense>Asia</MenuItem>
                </Select>
                <FormHelperText>Select region of origin</FormHelperText>
              </FormControl>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2}>Year of arrival</TableCell>
                    <TableCell colSpan={3}>
                      Year of diagnosis
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2000</TableCell>
                    <TableCell>2001</TableCell>
                    <TableCell>2002</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>2000</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>15</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2001</TableCell>
                    <TableCell style={{backgroundColor: 'red', color: 'white'}}>87</TableCell>
                    <TableCell>23</TableCell>
                    <TableCell>54</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2002</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>5</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>2003</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>23</TableCell>
                    <TableCell style={{backgroundColor: 'red', color: 'white'}}>76</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3>3. Estimates of the proportion of the migrants infected prior and post arrival</h3>

              <p>Table 3. Proportion of migrants infected post arrival by sex, age group and transmission category</p>

              <p>Figure 1. Proportion of migrants infected post arrival by region of origin and year of arrival</p>
              <HIVChart
                year={[2000, 2001, 2002, 2003]}
                model={[20, 50, 40, 30]}
                min={[15, 30, 30, 20]}
                range={[10, 20, 25, 20]}
              />

              <p>Figure 2. Proportion of migrants infected post arrival by region of origin and year of diagnosis</p>
              <HIVChart
                year={[2000, 2001, 2002, 2003]}
                model={[20, 50, 40, 30]}
                min={[15, 30, 30, 20]}
                range={[10, 20, 25, 20]}
              />

            </div>}
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabMigrant);

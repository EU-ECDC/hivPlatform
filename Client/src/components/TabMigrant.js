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
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Btn from './Btn';
import MigrChart from './Charts/MigrChart';
import HIVChart from './Charts/HIVChart';
import IsNull from '../utilities/IsNull';
import ProgressBar from './ProgressBar';

const Title = (props) => <Typography variant='caption' component='div' {...props}/>

const StyledTableCell = (props) => {
  const { isTotal, value, ...rest } = props;
  const style = isTotal ? {
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9'
  } : null;

  return (
    <TableCell {...rest} sx={style}>{value}</TableCell>
  )
}

const TabMigrant = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);
  const [tabId, setTabId] = React.useState(1);
  const [migrRegion, setMigrRegion] = React.useState('All');
  const handleMigrRegionChange = e => setMigrRegion(e.target.value);

  const missingness = appMgr.migrMgr.missingnessArray;

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
              <Tab
                label='Run log'
                disabled={IsNull(appMgr.migrMgr.runLog) }
              />
              <Tab
                label='Diagnostics'
                disabled={IsNull(appMgr.migrMgr.stats) }
              />
            </Tabs>
            {tabId === 0 && <React.Fragment>
              <pre
                dangerouslySetInnerHTML={{ __html: appMgr.migrMgr.runLog }}
                style={{ overflowX: 'auto', fontSize: '0.75rem' }}
              />
            </React.Fragment>}
            {tabId === 1 && !IsNull(appMgr.migrMgr.stats) && <div style={{maxWidth: 1000}}>
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

              <Title>Table 1. Cases excluded due to missing values</Title>
              <Table size='small'>
                <TableHead>
                  <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
                    <TableCell width='500px'>Missing variable</TableCell>
                    <TableCell align='right'>Number of excluded cases</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    missingness.map((el, i) => (
                      <TableRow key={i}>
                        <StyledTableCell value={el.excluded} isTotal={el.isTotal} />
                        <StyledTableCell value={el.count} isTotal={el.isTotal} align='right' />
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>

              <h3>2. Description of data used in estimation</h3>

              <Title>Figure 1. Number of cases by Year of Arrival and Region For Migration Module</Title>
              <MigrChart data={appMgr.migrMgr.regionDistr} />
              <Title>Figure 2. Number of cases by the Year of Arrival and Year of Diagnosis</Title>
              <FormControl>
                <Select
                  value={migrRegion}
                  onChange={handleMigrRegionChange}
                >
                  <MenuItem value='All' dense>All</MenuItem>
                  <MenuItem value='Africa' dense>Africa</MenuItem>
                  <MenuItem value='Europe-North America' dense>Europe-North America</MenuItem>
                  <MenuItem value='Asia' dense>Asia</MenuItem>
                  <MenuItem value='Other' dense>Other</MenuItem>
                </Select>
                <FormHelperText>Select region for migration</FormHelperText>
              </FormControl>
              <MigrChart data={{
                chartCategoriesX: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
                chartCategoriesY: [2014, 2015, 2016, 2017, 2018],
                seriesData: [
                  [0, 0, 39], [0, 1, 21], [0, 2, 5], [0, 3, 7], [0, 4, 10],
                  [1, 0, 77], [1, 1, 45], [1, 2, 8], [1, 3, 22], [1, 4, 10],
                  [2, 0, 97], [2, 1, 39], [2, 2, 7], [2, 3, 18], [2, 4, 10],
                  [3, 0, 38], [3, 1, 17], [3, 2, 2], [3, 3, 6], [3, 4, 110],
                  [4, 0, 38], [4, 1, 17], [4, 2, 2], [4, 3, 6], [4, 4, 110],
                  [5, 0, 38], [5, 1, 17], [5, 2, 2], [5, 3, 6], [5, 4, 110],
                  [6, 0, 38], [6, 1, 17], [6, 2, 2], [6, 3, 6], [6, 4, 110],
                  [7, 0, 38], [7, 1, 17], [7, 2, 2], [7, 3, 6], [7, 4, 110],
                ],
                dataMax: 110
              }}
              />

              <h3>3. Estimates of the proportion of the migrants infected prior and post arrival</h3>

              <Title>Table 2. Proportion of migrants infected post arrival by sex, age group and transmission category</Title>
              <FormControl>
                <Select
                  value='All'
                >
                  <MenuItem value='All' dense>All</MenuItem>
                  <MenuItem value='Europe-North America' dense>Europe-North America</MenuItem>
                  <MenuItem value='Africa' dense>Africa</MenuItem>
                  <MenuItem value='Asia' dense>Asia</MenuItem>
                  <MenuItem value='Other' dense>Other</MenuItem>
                </Select>
                <FormHelperText>Select region for migration</FormHelperText>
              </FormControl>
              <Table size='small'>
                <TableHead>
                  <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
                    <TableCell width='100px'>Category</TableCell>
                    <TableCell align='right'>Count</TableCell>
                    <TableCell align='right'>Proportion infected prior to arrival</TableCell>
                    <TableCell align='right'>95% CI for the proportion</TableCell>
                    <TableCell align='right'>Proportion infected post arrival</TableCell>
                    <TableCell align='right'>95% CI for the proportion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell value='Total' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='Sex:' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;Male' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;Female' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='Age group:' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;<25' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;25 - 39' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;40 - 54' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='&emsp;55+' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='Transmission category:' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                  </TableRow>
                 <TableRow>
                    <StyledTableCell value='&emsp;MSM' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                 <TableRow>
                    <StyledTableCell value='&emsp;IDU' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                 <TableRow>
                    <StyledTableCell value='&emsp;HETERO' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                 <TableRow>
                    <StyledTableCell value='&emsp;TRANSFU' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                  <TableRow>
                    <StyledTableCell value='Region of origin:' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                    <StyledTableCell value='' isTotal={true} />
                  </TableRow>
                 <TableRow>
                    <StyledTableCell value='&emsp;EUROPE' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                    <StyledTableCell value='' isTotal={false} />
                  </TableRow>
                </TableBody>
              </Table>

              <Title>Figure 3. Proportion of migrants infected post arrival by region of origin and year of arrival</Title>
              <HIVChart
                year={[2000, 2001, 2002, 2003]}
                model={[20, 50, 40, 30]}
                min={[15, 30, 30, 20]}
                range={[10, 20, 25, 20]}
              />

              <Title>Figure 4. Proportion of migrants infected post arrival by region of origin and year of diagnosis</Title>
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

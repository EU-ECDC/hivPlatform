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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
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
    <TableCell {...rest} sx={style} align='right'>{value}</TableCell>
  )
}

const TabMigrant = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);

  const [tabId, setTabId] = React.useState(1);

  const handleYodRegionChange = (e, value) => appMgr.migrMgr.setYodRegion(value);

  const handleTableRegionChange = e => appMgr.migrMgr.setTableRegion(e.target.value);

  const handleTabChange = (e, tabId) => setTabId(tabId);

  const handleRunBtnClick = () => appMgr.migrMgr.run();

  const handleCancelBtnClick = () => appMgr.migrMgr.cancel();

  const missingness = appMgr.migrMgr.missingnessArray;
  const endValue = appMgr.migrMgr.yodDistr.chartCategoriesX.length - 1;
  const startValue = Math.max(endValue - 20 + 1, 0);
  const tableDistr = appMgr.migrMgr.tableDistr;

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
              <ToggleButtonGroup
                exclusive
                size='small'
                color='primary'
                value={appMgr.migrMgr.yodRegion}
                onChange={handleYodRegionChange}
              >
                <ToggleButton value='All'>All</ToggleButton>
                <ToggleButton value='Africa'>Africa</ToggleButton>
                <ToggleButton value='Europe-North America'>Europe-North America</ToggleButton>
                <ToggleButton value='Asia'>Asia</ToggleButton>
                <ToggleButton value='Other'>Other</ToggleButton>
              </ToggleButtonGroup>
              <MigrChart
                data={appMgr.migrMgr.yodDistr}
                options={{
                  xAxis: {
                    inverse: true,
                  },
                  dataZoom: [
                    {
                      type: 'slider',
                      xAxisIndex: 0,
                      bottom: 10,
                      startValue: startValue,
                      endValue: endValue,
                      handleSize: '80%',
                      showDetail: true
                    }
                  ]
                }}
              />

              <h3>3. Estimates of the proportion of the migrants infected prior and post arrival</h3>

              <Title>Table 2. Proportion of migrants infected post arrival by sex, age group and transmission category</Title>
              <ToggleButtonGroup
                exclusive
                size='small'
                color='primary'
                value={appMgr.migrMgr.tableRegion}
                onChange={handleTableRegionChange}
                sx={{marginBottom: '5px'}}
              >
                <ToggleButton value='All'>All</ToggleButton>
                <ToggleButton value='Africa'>Africa</ToggleButton>
                <ToggleButton value='Europe-North America'>Europe-North America</ToggleButton>
                <ToggleButton value='Asia'>Asia</ToggleButton>
                <ToggleButton value='Other'>Other</ToggleButton>
              </ToggleButtonGroup>
              <Table size='small'>
                <TableHead>
                  <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
                    <TableCell width='220px' rowSpan={2}>Category</TableCell>
                    <TableCell align='right' rowSpan={2}>Count</TableCell>
                    <TableCell align='right' colSpan={2} sx={{textAlign: 'center'}}>Infected prior to arrival</TableCell>
                    <TableCell align='right' colSpan={2} sx={{textAlign: 'center'}}>Infected post arrival</TableCell>
                  </TableRow>
                  <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
                    <TableCell align='right'>Proportion</TableCell>
                    <TableCell align='right'>95% CI</TableCell>
                    <TableCell align='right'>Proportion</TableCell>
                    <TableCell align='right'>95% CI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell value='Total' isTotal={true} />
                    <StyledTableCell value={tableDistr.Total.Count} isTotal={true} />
                    <StyledTableCell value={tableDistr.Total.PriorProp} isTotal={true} />
                    <StyledTableCell value={`${tableDistr.Total.PriorLB} - ${tableDistr.Total.PriorUB}`} isTotal={true} />
                    <StyledTableCell value={tableDistr.Total.PostProp} isTotal={true} />
                    <StyledTableCell value={`${tableDistr.Total.PostLB} - ${tableDistr.Total.PostUB}`} isTotal={true} />
                  </TableRow>
                  {
                    tableDistr.Sex.map((r, i) => (
                      <TableRow key={i}>
                        <StyledTableCell value={r.Category} isTotal={i === 0} />
                        <StyledTableCell value={r.Count} isTotal={i === 0} />
                        <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                        <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
                      </TableRow>
                    ))
                  }
                  {
                  tableDistr.Age.map((r, i) => (
                      <TableRow key={i}>
                        <StyledTableCell value={r.Category} isTotal={i === 0} />
                        <StyledTableCell value={r.Count} isTotal={i === 0} />
                        <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                        <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
                      </TableRow>
                    ))
                  }
                  {
                  tableDistr.Transmission.map((r, i) => (
                      <TableRow key={i}>
                        <StyledTableCell value={r.Category} isTotal={i === 0} />
                        <StyledTableCell value={r.Count} isTotal={i === 0} />
                        <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                        <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
                      </TableRow>
                    ))
                  }
                  {
                  tableDistr.RegionOfOrigin.map((r, i) => (
                      <TableRow key={i}>
                        <StyledTableCell value={r.Category} isTotal={i === 0} />
                        <StyledTableCell value={r.Count} isTotal={i === 0} />
                        <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                        <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                        <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
                      </TableRow>
                    ))
                  }
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

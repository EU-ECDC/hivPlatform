import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LineCategoryChart from '../Charts/LineCategoryChart';
import IsNull from '../../utilities/IsNull';
import SmallTable from './SmallTable';

const TabModellingOutputsGraphs = ({ appMgr })  => {

  if (IsNull(appMgr.modelMgr.plotData)) {
    return (null);
  }

  const color = ['#69b023', '#7bbcc0', '#9d8b56', '#ce80ce', '#c7c7c7'];
  const legendOptions = { orient: 'horizontal', left: 'center', top: 0, selector: false };
  console.log(appMgr.modelMgr.outputTable1Data);

  return (
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          A. HIV infections per year
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.outputTable1Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.outputPlot1Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          B. Time to diagnosis
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.outputTable2Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Years'
          data={appMgr.modelMgr.outputPlot2Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          C. Total number of HIV-infected
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.outputTable3Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.outputPlot3Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          D. Proportion undiagnosed of all those alive
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.outputTable4Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Proportion'
          data={appMgr.modelMgr.outputPlot4Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGraphs);

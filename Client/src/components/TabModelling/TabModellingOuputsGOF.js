import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LineCategoryChart from '../Charts/LineCategoryChart';
import IsNull from '../../utilities/IsNull';
import SmallTable from './SmallTable';

const TabModellingOutputsGOF = props => {

  const { appMgr } = props;
  if (IsNull(appMgr.modelMgr.plotData)) {
    return null;
  }

  const color = ['#69b023', '#c7c7c7'];
  const legendOptions = { orient: 'horizontal', left: 'center', top: 0, selector: false };

  return (
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          A. HIV diagnoses, total
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable1Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot1Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>
          B. HIV diagnoses, CD4 {'\u2265'} 500
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable2Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot2Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          C. HIV diagnoses, CD4 350 - 499
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable3Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot3Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>
          D. HIV diagnoses, CD4 200 - 349
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable4Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot4Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>
          E. HIV diagnoses, CD4 {'<'} 200
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable5Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot5Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>
          F. HIV/AIDS diagnoses
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable6Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot6Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6'>
          G. AIDS diagnoses, total
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <SmallTable tableData={appMgr.modelMgr.gofTable7Data} />
      </Grid>
      <Grid item xs={8}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={appMgr.modelMgr.gofPlot7Data}
          legendOptions={legendOptions}
          color={color}
          showConfBounds={appMgr.modelMgr.showConfBounds}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGOF);

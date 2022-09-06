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

  const color = ['#69b023', '#7bbcc0', '#9d8b56', '#ce80ce'];
  const legendOptions = { orient: 'horizontal', left: 'center', top: 0, selector: false };

  return (
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          A. HIV infections per year
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.outputTable1Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'HIV Diagnoses',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Inf_M[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            },
            // {
            //   name: 'New arrivals of infected migrants',
            //   values: appMgr.modelMgr.plotData.Year.map((year, i) => [
            //     year,
            //     appMgr.modelMgr.plotData.NewMigrantDiagnoses[i],
            //     null,
            //     null,
            //     'solid'
            //   ])
            // }
          ]}
          legendOptions={legendOptions}
          color={color}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          B. Time to diagnosis
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.outputTable2Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Years'
          data={[
            {
              name: 'Time to diagnosis',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.t_diag[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            },
          ]}
          legendOptions={legendOptions}
          color={color}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          C. Total number of HIV-infected
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.outputTable3Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Alive',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Alive[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            },
            {
              name: 'Undiagnosed from model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Und[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            },
            {
              name: 'Diagnosed from model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Alive_Diag_M[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            }
          ]}
          legendOptions={legendOptions}
          color={color}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          D. Proportion undiagnosed of all those alive
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.outputTable4Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Proportion'
          data={[
            {
              name: 'Proportion of undiagnosed',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Und_Alive_p[i],
                null,
                null,
                'solid'
              ]),
              selected: true
            },
          ]}
          legendOptions={legendOptions}
          color={color}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGraphs);

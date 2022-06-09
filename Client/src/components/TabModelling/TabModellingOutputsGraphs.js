import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import HIVChart from '../Charts/HIVChart';
import HIVChart2 from '../Charts/HIVChart2';
import IsNull from '../../utilities/IsNull';
import SmallTable from './SmallTable';

const TabModellingOutputsGraphs = ({ appMgr })  => {

  if (IsNull(appMgr.modelMgr.plotData)) {
    return (null);
  }

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
        <HIVChart2
          data={[
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Inf_M[i]
              ]),
              name: 'HIV Diagnoses'
            },
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.NewMigrantDiagnoses[i]
              ]),
              name: 'New arrivals of infected migrants'
            }
          ]}
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
        <HIVChart2
          data={[
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.t_diag[i]
              ]),
              name: 'Time to diagnosis'
            },
          ]}
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
        <HIVChart2
          data={[
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Alive[i]
              ]),
              name: 'Alive'
            },
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Alive_Diag_M[i]
              ]),
              name: 'Diagnosed'
            },
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Und[i]
              ]),
              name: 'Undiagnosed'
            }
          ]}
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
        <HIVChart2
          data={[
            {
              data: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_Und_Alive_p[i]
              ]),
              name: 'Proportion of undiagnosed'
            },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGraphs);

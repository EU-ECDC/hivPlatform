import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import HIVChart from '../Charts/HIVChart';
import IsNull from '../../utilities/IsNull';
import SmallTable from './SmallTable';

const TabModellingOutputsGraphs = props => {

  const { appMgr } = props;

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
        <HIVChart
          year={appMgr.modelMgr.plotData.Year}
          model={appMgr.modelMgr.plotData.N_Inf_M}
          min={appMgr.modelMgr.plotData.N_Inf_M_LB}
          range={appMgr.modelMgr.plotData.N_Inf_M_Range}
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
        <HIVChart
          year={appMgr.modelMgr.plotData.Year}
          model={appMgr.modelMgr.plotData.t_diag}
          min={appMgr.modelMgr.plotData.t_diag_LB}
          range={appMgr.modelMgr.plotData.t_diag_Range}
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
        <HIVChart
          year={appMgr.modelMgr.plotData.Year}
          model={appMgr.modelMgr.plotData.N_Alive}
          min={appMgr.modelMgr.plotData.N_Alive_LB}
          range={appMgr.modelMgr.plotData.N_Alive_Range}
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
        <HIVChart
          year={appMgr.modelMgr.plotData.Year}
          model={appMgr.modelMgr.plotData.N_Und_Alive_p}
          min={appMgr.modelMgr.plotData.N_Und_Alive_p_LB}
          range={appMgr.modelMgr.plotData.N_Und_Alive_p_Range}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGraphs);

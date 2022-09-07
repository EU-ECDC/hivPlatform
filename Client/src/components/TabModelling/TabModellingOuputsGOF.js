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
    return (null);
  }

  const color = ['#69b023', '#c7c7c7'];
  const legendOptions = { orient: 'horizontal', left: 'center', top: 0, selector: false };

  return (
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={5}>
      </Grid>
      <Grid item xs={7}>
        <Typography variant='body2'>
          Dotted curves represent data not used in the modelling (see tab "Advanced").
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          A. HIV diagnoses, total
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable1Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_HIV_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_HIV_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_HIV_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_HIV_Obs_M_LB) ? appMgr.modelMgr.plotData.N_HIV_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_HIV_Obs_M_UB) ? appMgr.modelMgr.plotData.N_HIV_Obs_M_UB[i] : null,
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
          B. HIV diagnoses, CD4 {'\u2265'} 500
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable2Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_1_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_CD4_1_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_1_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_CD4_1_Obs_M_LB) ? appMgr.modelMgr.plotData.N_CD4_1_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_CD4_1_Obs_M_UB) ? appMgr.modelMgr.plotData.N_CD4_1_Obs_M_UB[i] : null,
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
          C. HIV diagnoses, CD4 350 - 499
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable3Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_2_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_CD4_2_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_2_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_CD4_2_Obs_M_LB) ? appMgr.modelMgr.plotData.N_CD4_2_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_CD4_2_Obs_M_UB) ? appMgr.modelMgr.plotData.N_CD4_2_Obs_M_UB[i] : null,
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
          D. HIV diagnoses, CD4 200 - 349
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable4Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_3_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_CD4_3_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_3_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_CD4_3_Obs_M_LB) ? appMgr.modelMgr.plotData.N_CD4_3_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_CD4_3_Obs_M_UB) ? appMgr.modelMgr.plotData.N_CD4_3_Obs_M_UB[i] : null,
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
          E. HIV diagnoses, CD4 {'<'} 200
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable5Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_4_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_CD4_4_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_CD4_4_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_CD4_4_Obs_M_LB) ? appMgr.modelMgr.plotData.N_CD4_4_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_CD4_4_Obs_M_UB) ? appMgr.modelMgr.plotData.N_CD4_4_Obs_M_UB[i] : null,
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
          F. HIV/AIDS diagnoses
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable6Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_HIVAIDS_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_HIVAIDS_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_LB) ? appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_UB) ? appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_UB[i] : null,
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
          G. AIDS diagnoses, total
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <SmallTable tableData={appMgr.modelMgr.gofTable7Data} />
      </Grid>
      <Grid item xs={7}>
        <LineCategoryChart
          xAxisTitle='Year'
          yAxisTitle='Count'
          data={[
            {
              name: 'Data',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_AIDS_D[i],
                null,
                null,
                appMgr.modelMgr.plotData.N_AIDS_D_Used[i] ? 'solid' : 'dotted'
              ]),
              selected: true
            },
            {
              name: 'Model',
              values: appMgr.modelMgr.plotData.Year.map((year, i) => [
                year,
                appMgr.modelMgr.plotData.N_AIDS_M[i],
                !IsNull(appMgr.modelMgr.plotData.N_AIDS_M_LB) ? appMgr.modelMgr.plotData.N_AIDS_M_LB[i] : null,
                !IsNull(appMgr.modelMgr.plotData.N_AIDS_M_UB) ? appMgr.modelMgr.plotData.N_AIDS_M_UB[i] : null,
                'solid'
              ]),
              selected: true
            }
          ]}
          legendOptions={legendOptions}
          color={color}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsGOF);

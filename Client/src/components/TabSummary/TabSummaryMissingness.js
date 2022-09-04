import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import MissChart from '../Charts/MissChart';
import LineChart from '../Charts/LineChart_v1';

const TabSummaryMissingness = (props) => {
  const { appMgr } = props;

  const handleDataSelection = (e) => appMgr.summaryDataMgr.setMissPlotSelection(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6'>
          Missing data summary: key variables
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='body2' color='textSecondary'>
          Percentages of cases for which the information was not available (missing) for one or
          more of the key variables: CD4 count, transmission category, migrant status or age.
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='missDataSelection'
            value={appMgr.summaryDataMgr.missPlotSelection}
            onChange={handleDataSelection}
          >
            <FormControlLabel
              value='all'
              control={<Radio color='primary' size='small' />}
              label='All'
            />
            <FormControlLabel
              value='female'
              control={<Radio color='primary' size='small' />}
              label='Female'
            />
            <FormControlLabel
              value='male'
              control={<Radio color='primary' size='small' />}
              label='Male'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={10}>
        <Paper style={{ padding: 10 }}>
          <Grid container>
            <Grid item xs={12}>
              <MissChart
                xCategories={appMgr.summaryDataMgr.missPlotData.plot1.chartCategories}
                data1={appMgr.summaryDataMgr.missPlot1Series}
                data2={appMgr.summaryDataMgr.missPlot2Series}
                data3={appMgr.summaryDataMgr.missPlot3Series}
              />
            </Grid>
            <Grid item xs={12}>
              <LineChart
                yLabelName='Proportion of missing values'
                xCategories={appMgr.summaryDataMgr.missPlot4Categories}
                data={appMgr.summaryDataMgr.missPlot4Series}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryMissingness);

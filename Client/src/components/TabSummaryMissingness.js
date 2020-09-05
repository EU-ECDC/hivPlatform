import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chart from 'react-apexcharts';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import merge from 'lodash/merge';
import {
  defaultMissChart1Options, defaultMissChart2Options, defaultMissChart3Options,
  defaultMissChart4Options
} from './ChartsData';

const TabSummaryMissingness = (props) => {
  const { appManager } = props;

  const missChart1Options = merge(
    {},
    defaultMissChart1Options,
    { xaxis: { categories: appManager.summaryDataMgr.missPlotData.plot1.chartCategories } }
  );

  const missChart3Options = merge(
    {},
    defaultMissChart3Options,
    { xaxis: { categories: appManager.summaryDataMgr.missPlot3Categories } }
  );

  const missChart4Options = merge(
    {},
    defaultMissChart4Options,
    { xaxis: { categories: appManager.summaryDataMgr.missPlot4Categories } }
  );

  const handleDataSelection = (e) => appManager.summaryDataMgr.setMissPlotSelection(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography variant='h6'>
          Missing data summary: key variables
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Percentages of cases for which the information was not available (missing) for one or
          more of the key variables: CD4 count, transmission category, migrant status or age.
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='missDataSelection'
            value={appManager.summaryDataMgr.missPlotSelection}
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
      <Grid item xs={9}>
        <Paper style={{ padding: 10 }}>
          <Grid container>
            <Grid item xs={3}>
              <Chart
                options={missChart1Options}
                series={appManager.summaryDataMgr.missPlot1Series}
                type='bar'
                height={400}
              />
            </Grid>
            <Grid item xs={4}>
              <Chart
                options={defaultMissChart2Options}
                series={appManager.summaryDataMgr.missPlot2Series}
                type='heatmap'
                height={400}
              />
            </Grid>
            <Grid item xs={5}>
              <Chart
                options={missChart3Options}
                series={appManager.summaryDataMgr.missPlot3Series}
                type='bar'
                height={400}
              />
            </Grid>
            <Grid item xs={12}>
              <Chart
                options={missChart4Options}
                series={appManager.summaryDataMgr.missPlot4Series}
                type='area'
                height={400}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryMissingness);

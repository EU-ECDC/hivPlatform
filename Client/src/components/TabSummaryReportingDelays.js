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
import { defaultRepDelChartOptions } from './ChartsData';

const TabSummaryReportingDelays = (props) => {
  const { appManager } = props;

  const handleDataSelection = (e) => appManager.summaryDataMgr.setRepDelPlotSelection(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography variant='h6'>
          Reporting delays summary
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Average reporting delay for cases notified within a quarter and the upper bound for
          typical average delay values. Quarters when the average delay exceeds the upper bound
          may indicate cleaning events in surveillance.
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='repDelDataSelection'
            value={appManager.summaryDataMgr.repDelPlotData.selected}
            onChange={handleDataSelection}
          >
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
            <FormControlLabel
              value='all'
              control={<Radio color='primary' size='small' />}
              label='All'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <Paper style={{ padding: 10 }}>
          <Chart
            options={defaultRepDelChartOptions}
            series={appManager.summaryDataMgr.repDelPlotSeries}
            type='area'
            height={400}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryReportingDelays);

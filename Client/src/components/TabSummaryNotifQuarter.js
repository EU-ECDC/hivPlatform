import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Chart from 'react-apexcharts';
import merge from 'lodash/merge';
import { defaultNotifChartOptions } from './ChartsData';
import QuarterToString from '../utilities/QuarterToString';

const userStyles = makeStyles({
  valueLabel: {
    '& span': {
      '& span': {
        // color: 'white',
        fontSize: 8
      }
    }
  }
});

const TabSummaryNotifQuarter = (props) => {
  const { appMgr } = props;
  const classes = userStyles();

  const notifChartOptions = merge(
    {},
    defaultNotifChartOptions,
    {
      xaxis: {
        categories: appMgr.summaryDataMgr.notifQuarterChartCategories
      }
    }
  );

  const handleNotifQuarterFilterSwitchChange = e =>
    appMgr.summaryDataMgr.setNotifQuarterFilterApply(e.target.checked);

  const handleNotifQuarterFilterYearChange = (e, value) => {
    appMgr.summaryDataMgr.setNotifQuarterFilterMinYear(value[0]);
    appMgr.summaryDataMgr.setNotifQuarterFilterMaxYear(value[1]);
  };

  const notifChart = (
    <Chart
      options={notifChartOptions}
      series={appMgr.summaryDataMgr.notifQuarterPlotData.chartData}
      type='bar'
      height={200}
    />
  )

  return (
    <React.Fragment>
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <Switch
              value={appMgr.summaryDataMgr.notifQuarterPlotData.filter.applyInAdjustments}
              onChange={handleNotifQuarterFilterSwitchChange}
              color='primary'
              size='small'
            />
          }
          label='Apply this data selection in adjustments'
        />
      </Grid>
      <Grid item xs={10}>
        <Paper style={{ padding: 10 }}>
          <Typography variant='overline'>Notification quarter</Typography>
          <div style={{ padding: '40px 105px 0 65px' }}>
            <Slider
              min={appMgr.summaryDataMgr.notifQuarterPlotData.filter.scaleMinYear}
              max={appMgr.summaryDataMgr.notifQuarterPlotData.filter.scaleMaxYear}
              // step={0.25}s
              step={null}
              marks={appMgr.summaryDataMgr.notifQuarterSliderMarks}
              value={[
                appMgr.summaryDataMgr.notifQuarterPlotData.filter.valueMinYear,
                appMgr.summaryDataMgr.notifQuarterPlotData.filter.valueMaxYear
              ]}
              onChange={handleNotifQuarterFilterYearChange}
              valueLabelDisplay='on'
              valueLabelFormat={value => QuarterToString(value)}
              classes={{
                valueLabel: classes.valueLabel
              }}
              aria-labelledby='range-slider'
              color='secondary'
            />
          </div>
          {notifChart}
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryNotifQuarter);

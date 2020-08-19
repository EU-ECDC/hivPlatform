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
import { defaultNotifChartOptions } from './ChartsData';

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
  const { appManager } = props;
  const classes = userStyles();

  let notifChartOptions = defaultNotifChartOptions;
  notifChartOptions.categories = appManager.summaryDataMgr.notifQuarterPlotData.chartCategories;

  const handleNotifQuarterFilterSwitchChange = e =>
    appManager.summaryDataMgr.setNotifQuarterFilterApply(e.target.checked);

  const handleNotifQuarterFilterYearChange = (e, value) => {
    appManager.summaryDataMgr.setNotifQuarterFilterMinYear(value[0]);
    appManager.summaryDataMgr.setNotifQuarterFilterMaxYear(value[1]);
  };

  const notifChart = (
    <Chart
      options={notifChartOptions}
      series={appManager.summaryDataMgr.notifQuarterPlotData.chartData}
      type='bar'
      height={200}
    />
  )

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography color='textSecondary'>
          Filter data on quarter of notification
          </Typography>
        <FormControlLabel
          control={
            <Switch
              value={appManager.summaryDataMgr.notifQuarterPlotData.filter.applyInAdjustments}
              onChange={handleNotifQuarterFilterSwitchChange}
              color='primary'
              size='small'
            />
          }
          label='Apply filter in adjustments'
        />
      </Grid>
      <Grid item xs={9}>
        <Paper style={{ padding: 10 }}>
          <Typography variant='overline'>Notification quarter</Typography>
          <div style={{ padding: '40px 100px 0 50px' }}>
            <Slider
              min={appManager.summaryDataMgr.notifQuarterPlotData.filter.scaleMinYear}
              max={appManager.summaryDataMgr.notifQuarterPlotData.filter.scaleMaxYear}
              marks={true}
              value={[
                appManager.summaryDataMgr.notifQuarterPlotData.filter.valueMinYear,
                appManager.summaryDataMgr.notifQuarterPlotData.filter.valueMaxYear
              ]}
              onChange={handleNotifQuarterFilterYearChange}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed(2)}
              classes={{
                valueLabel: classes.valueLabel
              }}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed(2)}
              getAriaValueText={value => value.toFixed(2)}
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

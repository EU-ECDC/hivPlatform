import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Chart from 'react-apexcharts';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import TabPanel from './TabPanel';
import {
  defDiagChartOptions,
  defNotifChartOptions,
  missChartSeries, missChartOptions, missChartSeries2,
  missChartOptions2, missChartSeries3, missChartOptions3, missChartSeries4, missChartOptions4,
  rdSeries1, rdOptions1
} from './ChartsData';

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

const TabSummary = (props) => {
  const { appManager } = props;
  const classes = userStyles();

  let diagChartOptions = defDiagChartOptions;
  diagChartOptions.categories = appManager.diagnosisYearChartCategories;

  console.log(appManager.notifQuarterChartCategories)

  let notifChartOptions = defNotifChartOptions;
  notifChartOptions.categories = appManager.notifQuarterChartCategories;
  const notifChartMarks = notifChartOptions.xaxis.categories.map((el, idx) =>
    ({
      value: el,
      label: idx % 2 ? null : el.toFixed(2)
    })
  );

  const diagChart = (
    <Chart
      options={diagChartOptions}
      series={appManager.diagnosisYearChartData}
      type='bar'
      height={200}
    />
  )

  const notifChart = (
    <Chart
      options={notifChartOptions}
      series={appManager.notifQuarterChartData}
      type='bar'
      height={200}
    />
  )

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Filter data on year of diagnosis
          </Typography>
          <FormControlLabel
            control={<Switch checked={true} onChange={() => { }} name='checkedA' color='primary' size='small'/>}
            label='Apply filter in adjustments'
          />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Diagnosis year</Typography>
            <div style={{padding: '40px 100px 0 50px'}}>
              <Slider
                min={appManager.diagnosisYearFilterData.ScaleMinYear}
                max={appManager.diagnosisYearFilterData.ScaleMaxYear}
                marks={true}
                defaultValue={[
                  appManager.diagnosisYearFilterData.ValueMinYear,
                  appManager.diagnosisYearFilterData.ValueMaxYear
                ]}
                valueLabelDisplay='on'
                valueLabelFormat={value=> value.toFixed()}
                classes={{
                  valueLabel: classes.valueLabel
                }}
                aria-labelledby='range-slider'
                getAriaLabel={index => index.toFixed()}
                getAriaValueText={value => value.toFixed()}
                color='secondary'
              />
            </div>
            {diagChart}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Filter data on quarter of notification
          </Typography>
          <FormControlLabel
            control={<Switch checked={true} onChange={() => { }} name='checkedB' color='primary' size='small' />}
            label='Apply filter in adjustments'
          />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Notification quarter</Typography>
            <div style={{padding: '40px 100px 0 50px'}}>
              <Slider
                min={appManager.notifQuarterFilterData.ScaleMinYear}
                max={appManager.notifQuarterFilterData.ScaleMaxYear}
                marks={true}
                defaultValue={[
                  appManager.notifQuarterFilterData.ScaleMinYear,
                  appManager.notifQuarterFilterData.ScaleMaxYear
                ]}
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
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography variant='h6'>
            Missing data summary: key variables
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Percentages of cases for which the information was not available (missing) for one or
            more of the key variables: CD4 count, transmission category, migrant status or age.
          </Typography>
          <FormControl component='fieldset'>
            <RadioGroup name='missDataType' defaultValue='all'>
              <FormControlLabel
                value='all'
                control={<Radio color='primary' size='small' />}
                label='All'
              />
              <FormControlLabel
                value='male'
                control={<Radio color='primary' size='small' />}
                label='Male'
              />
              <FormControlLabel
                value='female'
                control={<Radio color='primary' size='small' />}
                label='Female'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Grid container>
              <Grid item xs={3}>
                <Chart
                  options={missChartOptions}
                  series={missChartSeries}
                  type='bar'
                  height={400}
                />
              </Grid>
              <Grid item xs={4}>
                <Chart
                  options={missChartOptions2}
                  series={missChartSeries2}
                  type='heatmap'
                  height={400}
                />
              </Grid>
              <Grid item xs={5}>
                <Chart
                  options={missChartOptions3}
                  series={missChartSeries3}
                  type='bar'
                  height={400}
                />
              </Grid>
              <Grid item xs={12}>
                <Chart
                  options={missChartOptions4}
                  series={missChartSeries4}
                  type='area'
                  height={400}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
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
            <RadioGroup name='reportDelaysDataType' defaultValue='all'>
              <FormControlLabel
                value='all'
                control={<Radio color='primary' size='small' />}
                label='All'
              />
              <FormControlLabel
                value='male'
                control={<Radio color='primary' size='small' />}
                label='Male'
              />
              <FormControlLabel
                value='female'
                control={<Radio color='primary' size='small' />}
                label='Female'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Chart
              options={rdOptions1}
              series={rdSeries1}
              type='area'
              height={400}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  )
};

export default observer(TabSummary);

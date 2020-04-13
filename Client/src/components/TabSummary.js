import React from 'react';
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
import FormLabel from '@material-ui/core/FormLabel';import TabPanel from './TabPanel';
import {
  filterDiagChartSeries, filterNotifChartSeries, filterDiagChartOptions1, marks,
  filterNotifChartOptions1, notifMarks, missChartSeries, missChartOptions, missChartSeries2,
  missChartOptions2, missChartSeries3, missChartOptions3, missChartSeries4, missChartOptions4
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

const TabSummary = () => {
  const classes = userStyles();

  const zoomChart = (
    <Chart
      options={filterDiagChartOptions1}
      series={filterDiagChartSeries}
      type='bar'
      height={200}
    />
  )

  const notifChart = (
    <Chart
      options={filterNotifChartOptions1}
      series={filterNotifChartSeries}
      type='bar'
      height={200}
    />
  )

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
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
                min={1991}
                max={1999}
                marks={marks}
                defaultValue={[1994, 1996]}
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
            {zoomChart}
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
                min={1991.25}
                max={2007.75}
                marks={notifMarks}
                step={null}
                defaultValue={[1994.25, 1996.75]}
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
              options={{
                chart: {
                  parentHeightOffset: 15
                },
                dataLabels: {
                  enabled: false
                },
                annotations: {
                  xaxis: [{
                    x: 1.25,
                    borderColor: '#69b023',
                    strokeDashArray: 0,
                    label: {
                      text: '95% of cases reported by 5 quarters',
                      orientation: 'horizontal',
                      borderColor: '#69b023',
                      style: {
                        color: 'white',
                        background: '#69b023'
                      }
                    }
                  }]
                },
                xaxis: {
                  type: 'numeric',
                  title: {
                    text: 'Notification time in quarters of the year',
                    style: {
                      fontWeight: 'normal'
                    },
                    offsetY: 10
                  },
                },
                yaxis: {
                  min: 0,
                  title: {
                    text: 'Proportion of reported with the delay',
                    style: {
                      fontWeight: 'normal'
                    },
                    offsetY: 10
                  },

                }
              }}
              series={[
                { name: 'density', data: [[0, 0.25], [0.25, 0.28], [0.5, 0.4], [0.75, 0.25], [1, 0.16], [1.25, 0.05], [1.5, 0.013], [1.75, 0.007], [2, 0.002], [2.25, 0.001]]}
              ]}
              type='area'
              height={400}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  )
};


export default TabSummary;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chart from "react-apexcharts";

const filterDiagChartSeries = [
  {
    name: 'Female',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 54]
  },
  {
    name: 'Male',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 54]
  }
];

const filterNotifChartSeries = [
  {
    name: 'Female',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 54, 30, 40, 45, 50, 49, 60, 70, 91, 54]
  },
  {
    name: 'Male',
    data: [30, 40, 45, 50, 49, 60, 70, 91, 54, 30, 40, 45, 50, 49, 60, 70, 91, 54]
  }
];

const filterDiagChartOptions1 = {
  chart: {
    id: 'filter-diag-chart-1',
    stacked: true,
    selection: {
      enabled: false,
      type: 'x'
    },
    toolbar: {
    },
    events: {
      selection: null,
      click: null
    },
  },
  colors: ["#69b023", "#7bbcc0", "#ce80ce", "#9d8b56"],
  /*
  theme: {
    palette: 'palette6'
  },
  */
  title: {
    text: 'Histogram of cases count per year of diagnosis',
    style: {
      fontWeight: 'normal'
    }
  },
  legend: {
    position: 'right',
    offsetY: 60,
  },
  plotOptions: {
    bar: {
      columnWidth: '100%',
    }
  },
  dataLabels: {
    enabled: false
  },
  fill: {},
  stroke: {
    show: true,
    width: 1,
    colors: 'white',
    curve: 'stepline'
  },
  xaxis: {
    title: {
      text: 'Diagnosis year',
      style: {
        fontWeight: 'normal'
      }
    },
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    tickPlacement: 'between',
  },
  yaxis: {
    title: {
      text: 'Count',
      style: {
        fontWeight: 'normal'
      }

    },
    labels: {
      minWidth: 40,
      maxWidth: 40
    }
  },
  grid: {
    row: {
      colors: ['#fff', '#f2f2f2']
    },
    padding: {
      //left: 0
    }
  },
};

const marks = filterDiagChartOptions1.xaxis.categories.map(function(el) {
  return({
    value: el,
    label: el.toString()
  })
})

const filterNotifChartOptions1 = {
  chart: {
    id: 'filter-notif-chart-1',
    stacked: true,
    selection: {
      enabled: false,
      type: 'x'
    },
    toolbar: {
    },
    events: {
      selection: null,
      click: null
    },
  },
  colors: ["#69b023", "#7bbcc0", "#ce80ce", "#9d8b56"],
  /*
  theme: {
    palette: 'palette6'
  },
  */
  title: {
    text: 'Histogram of cases count per quarter of notification',
    style: {
      fontWeight: 'normal'
    }
  },
  legend: {
    position: 'right',
    offsetY: 60,
  },
  plotOptions: {
    bar: {
      columnWidth: '100%',
    }
  },
  dataLabels: {
    enabled: false
  },
  fill: {},
  stroke: {
    show: true,
    width: 1,
    colors: 'white',
    curve: 'stepline'
  },
  xaxis: {
    title: {
      text: 'Notification quarter',
      style: {
        fontWeight: 'normal'
      }
    },
    categories: [
      1991.25, 1992.25, 1993.25, 1994.25, 1995.25, 1996.25, 1997.25, 1998.25, 1999.25,
      1999.75, 2000.75, 2001.75, 2002.75, 2003.75, 2004.75, 2005.75, 2006.75, 2007.75
    ],
    tickPlacement: 'between',
  },
  yaxis: {
    title: {
      text: 'Count',
      style: {
        fontWeight: 'normal'
      }

    },
    labels: {
      minWidth: 40,
      maxWidth: 40
    }
  },
  grid: {
    row: {
      colors: ['#fff', '#f2f2f2']
    },
    padding: {
      //left: 0
    }
  },
};

const notifMarks = filterNotifChartOptions1.xaxis.categories.map(function(el) {
  return({
    value: el,
    label: el.toString()
  })
})

const userStyles = makeStyles({
  valueLabel: {
    '& span': {
      '& span': {
        color: 'white'
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
      height={250}
    />
  )

  const notifChart = (
    <Chart
      options={filterNotifChartOptions1}
      series={filterNotifChartSeries}
      type='bar'
      height={250}
    />
  )

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
        <Typography color='textSecondary'>
              Select data for summary based on year of diagnosis
            </Typography>
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
                valueLabelFormat={(value)=> value}
                classes={{
                  valueLabel: classes.valueLabel
                }}
                aria-labelledby='range-slider'
                getAriaLabel={index => index.toString()}
                getAriaValueText={value => value}
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
              Select data for summary based on quarter of notification
            </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Notification quarter</Typography>
            <div style={{padding: '40px 100px 0 50px'}}>
              <Slider
                min={1991.25}
                max={1999.75}
                marks={notifMarks}
                defaultValue={[1994.25, 1996.75]}
                valueLabelDisplay='on'
                valueLabelFormat={value => value.toString()}
                classes={{
                  valueLabel: classes.valueLabel
                }}
                aria-labelledby='range-slider'
                getAriaLabel={index => index.toString()}
                getAriaValueText={value => value.toString()}
                color='secondary'
              />
            </div>
            {notifChart}
          </Paper>
        </Grid>
      </Grid>

    </React.Fragment>
  )
};


export default TabSummary;

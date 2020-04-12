import React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
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

const TabSummary = () => {
  const zoomChart = (
    <Chart
      options={filterDiagChartOptions1}
      series={filterDiagChartSeries}
      type='bar'
      height={250}
    />
  )

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Button size='small' color='primary'>Next step</Button>
        </Box>
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={9}>
        <Paper style={{padding: 10}}>
          <div style={{padding: '0 100px 0 50px'}}>
            <Slider
              min={1991}
              max={1999}
              marks={false}
              value={[1994, 1996]}
              valueLabelDisplay='auto'
              aria-labelledby='range-slider'
              getAriaValueText={(value) => `${value}°C`}
              color='secondary'
            />
          </div>
          {zoomChart}
        </Paper>
      </Grid>
    </Grid>

  )
};


export default TabSummary;

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Chart from "react-apexcharts";

const filterDiagChartSeries = [
  {
    name: 'Female',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  },
  {
    name: 'Male',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }
];

const filterDiagChartOptions1 = {
  chart: {
    id: 'filter-diag-chart-1',
    stacked: true,
    selection: {
      enabled: true,
      type: 'x'
    },
    toolbar: {
      autoSelected: 'pan',
      show: false
    },
    events: {
      selection: () => console.log('selection'),
      click: () => console.log('click')
    }
  },
  legend: {
    position: 'right',
    offsetY: 100,
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
    show: false,
  },
  xaxis: {
    title: {
      text: 'Diagnosis year'
    },
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    tickPlacement: 'on'
  },
  yaxis: {
    title: {
      text: 'Count',
    },
  },
  grid: {
    row: {
      colors: ['#fff', '#f2f2f2']
    }
  }
};

const filterDiagChartOptions2 = {
  chart: {
    id: 'filter-diag-chart-2',
    stacked: true,
    toolbar: {
      show: false
    },
    brush: {
      target: 'filter-diag-chart-1',
      enabled: true
    },
    selection: {
      enabled: true,
    },
  },
  legend: {
    position: 'right',
    offsetY: 100,
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
    show: false,
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    tickPlacement: 'on'
  },
  yaxis: {
    title: {
      text: '.',
    },
  },
};

const TabSummary = () => {
  const zoomChart = (
    <Chart
      options={filterDiagChartOptions1}
      series={filterDiagChartSeries}
      type='bar'
      width='100%'
      height={300}
    />
  )

  const filterChart = (
    <Chart
      options={filterDiagChartOptions2}
      series={filterDiagChartSeries}
      type='bar'
      width='100%'
      height={300}
    />
  )

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Button size='small' color='primary'>Next step</Button>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Slider
          min={0}
          max={100}
          value={[20, 34]}
          valueLabelDisplay='auto'
          aria-labelledby='range-slider'
          getAriaValueText={(value) => `${value}°C`}
        />
        {zoomChart}
        {filterChart}
      </Grid>
    </Grid>

  )
};


export default TabSummary;

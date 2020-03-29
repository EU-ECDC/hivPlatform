import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from "react-apexcharts";

const data1 = {
  options: {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
  ]
};

const data2 = {
  series: [
    {
      name: "Series 1",
      data: [{
        x: 'W1',
        y: 22
      }, {
        x: 'W2',
        y: 29
      }, {
        x: 'W3',
        y: 13
      }, {
        x: 'W4',
        y: 32
      }]
    },
    {
      name: "Series 2",
      data: [{
        x: 'W1',
        y: 43
      }, {
        x: 'W2',
        y: 43
      }, {
        x: 'W3',
        y: 43
      }, {
        x: 'W4',
        y: 43
      }]
    }
  ],
  plotOptions: {
    dataLabels: {
      enabled: false
    },
    title: {
      text: 'HeatMap Chart with Color Range'
    },
    chart: {
      animations: {
        enabled: false
      },
    },
    heatmap: {
      shadeIntensity: 0.5,

      colorScale: {
        ranges: [{
            from: -30,
            to: 5,
            name: 'low',
            color: '#00A100'
          },
          {
            from: 6,
            to: 20,
            name: 'medium',
            color: '#128FD9'
          },
          {
            from: 21,
            to: 45,
            name: 'high',
            color: '#FFB200'
          },
          {
            from: 46,
            to: 55,
            name: 'extreme',
            color: '#FF0000'
          }
        ]
      }
    }
  }
}

const TabSummary = () => (
  <Grid container>
    <Grid item xs={12}>
      <Chart options={data1.options} series={data1.series} type='line' width='100%' height={300} />
      <Chart options={data2.plotOptions} series={data2.series} title={data2.title} type='heatmap' width='100%' height={300} />
    </Grid>
  </Grid>
);


export default TabSummary;

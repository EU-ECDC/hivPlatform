export const defDiagChartOptions = {
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
    parentHeightOffset: 0
  },
  colors: ["#69b023", "#7bbcc0", "#ce80ce", "#9d8b56"],
  title: {
    // text: 'Histogram of cases count per year of diagnosis',
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
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    categories: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
    tickPlacement: 'between',
  },
  yaxis: {
    title: {
      text: 'Count',
      style: {
        fontWeight: 'normal'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      minWidth: 40,
      maxWidth: 40
    }
  },
  grid: {
    row: {
      // colors: ['#fff', '#f2f2f2']
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      //left: 0
    }
  },
  tooltip: {
    enabled: true,
    x: {
      show: true
    }
  }
};

/*
export const marks = defaultFilterDiagChartOptions.xaxis.categories.map(function (el) {
  return ({
    value: el,
    label: el.toString()
  })
})
*/

export const defNotifChartOptions = {
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
    sparkline: {
      enabled: false
    },
    parentHeightOffset: 0
  },
  colors: ["#69b023", "#7bbcc0", "#ce80ce", "#9d8b56"],
  /*
  theme: {
    palette: 'palette6'
  },
  */
  title: {
    // text: 'Histogram of cases count per quarter of notification',
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
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
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
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      minWidth: 40,
      maxWidth: 40
    }
  },
  grid: {
    row: {
      //colors: ['#fff', '#f2f2f2']
    },
    yaxis: {
      lines: {
        show: false
      }
    },
  },
};

export const missChartSeries = [
  {
    name: 'Missingness',
    data: [0.45, 0.23, 0.19, 0.12]
  }
];

export const missChartOptions = {
  chart: {
    id: 'miss-chart-1',
    selection: {
      enabled: false,
    },
    toolbar: {
      enabled: false
    },
    events: {
      selection: null,
      click: null
    },
    parentHeightOffset: 0
  },
  colors: ["#cccccc", "#7bbcc0", "#ce80ce", "#9d8b56"],
  legend: {
    enabled: false
  },
  dataLabels: {
    enabled: false
  },
  fill: {},
  stroke: {
    width: 1,
    colors: 'white'
  },
  plotOptions: {
    bar: {
      columnWidth: '100%'
    }
  },
  xaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    categories: ['CD4', 'Migrant', 'Transmission', 'Age'],
    tickPlacement: 'between',
  },
  yaxis: {
    title: {
      text: 'Relative frequency of missing data for each of variables',
      style: {
        fontWeight: 'normal'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      minWidth: 40,
      maxWidth: 40
    }
  },
  grid: {
    yaxis: {
      lines: {
        show: false
      }
    },
  },
};

export const missChartSeries2 = [
  {
    name: 'Layer 1',
    data: [
      { x: 'CD4', y: 1 },
      { x: 'Migrant', y: 1 },
      { x: 'Transmission', y: 1 },
      { x: 'Age', y: 1 }
    ]
  },
  {
    name: 'Layer 2',
    data: [
      { x: 'CD4', y: 0 },
      { x: 'Migrant', y: 1 },
      { x: 'Transmission', y: 0 },
      { x: 'Age', y: 1 }
    ]
  },
  {
    name: 'Layer 3',
    data: [
      { x: 'CD4', y: 1 },
      { x: 'Migrant', y: 0 },
      { x: 'Transmission', y: 1 },
      { x: 'Age', y: 1 }
    ]
  },
  {
    name: 'Layer 4',
    data: [
      { x: 'CD4', y: 1 },
      { x: 'Migrant', y: 0 },
      { x: 'Transmission', y: 0 },
      { x: 'Age', y: 0 }
    ]
  }
];


export const missChartOptions2 = {
  chart: {
    parentHeightOffset: 0
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
  },
  stroke: {
    width: 1
  },
  yaxis: {
    title: {
      text: 'Missing data patterns',
      style: {
        fontWeight: 'normal'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: false
    }
  },
  legend: {
    show: false,
  },
  plotOptions: {
    heatmap: {
      radius: 0,
      colorScale: {
        ranges: [{
          from: 0,
          to: 0,
          color: '#cccccc',
          name: 'Missing',
        },
        {
          from: 1,
          to: 1,
          color: '#69b023',
          name: 'Present',
        }],
      }
    }
  }
}

export const missChartSeries3 = [
  { name: 'Present', data: [{ x: 'Layer1', y: 0 }, { x: 'Layer2', y: 0 }, { x: 'Layer3', y: 0 }, { x: 'Layer4', y: 0.2622 }] },
  { name: 'Missing', data: [{ x: 'Layer1', y: 0.03 }, { x: 'Layer2', y: 0.07 }, { x: 'Layer3', y: 0.14 }, { x: 'Layer4', y: 0 }] }
];

export const missChartOptions3 = {
  chart: {
    stacked: true,
    parentHeightOffset: 0
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['26.22%', '14.00%', '7.00%', '3.00%'],
    labels: {
      show: false
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: 'right',
    offsetY: 150
  },
  yaxis: {
    opposite: true,
    axisBorder: {
      show: false,
    }
  },
  stroke: {
    show: true,
    width: 1,
    colors: 'white',
  },
  colors: ['#69b023', '#cccccc'],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
    }
  },
  grid: {
    padding: {
      bottom: 25
    },
    yaxis: {
      lines: {
        show: false
      }
    },
  },
}

export const missChartSeries4 = [
  { name: 'CD4', data: [0.2, 0.3, 0.5, 0.2, 0.4] },
  { name: 'Migrant', data: [0.4, 0.1, 0.09, 0.1, 0.7] },
  { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.12, 0.44] },
  { name: 'Age', data: [0.5, 0.2, 0.55, 0.6, 0.34] }
];

export const missChartOptions4 = {
  chart: {
    dropShadow: {
      enabled: false
    },
    parentHeightOffset: 0
  },
  xaxis: {
    categories: [1999, 2000, 2001, 2002, 2003],
    title: {
      text: 'Year of diagnosis',
      style: {
        fontWeight: 'normal'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    curve: 'straight',
    dashArray: 2
  },
  markers: {
    size: 5,
    hover: {
      size: 9
    }
  },
  legend: {
    position: 'right',
    offsetY: 150
  },
  yaxis: {
    title: {
      text: 'Proportion of missing values',
      style: {
        fontWeight: 'normal'
      }
    }
  }
};

export const rdSeries1 = [
  { name: 'density', data: [[0, 0.25], [0.25, 0.28], [0.5, 0.4], [0.75, 0.25], [1, 0.16], [1.25, 0.05], [1.5, 0.013], [1.75, 0.007], [2, 0.002], [2.25, 0.001]] }
];

export const rdOptions1 = {
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
  stroke: {
    width: 2
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
};

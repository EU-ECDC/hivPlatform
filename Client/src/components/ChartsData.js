export const defaultDiagChartOptions = {
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
      minWidth: 50,
      maxWidth: 50
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
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
};

export const defaultNotifChartOptions = {
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
    type: 'category',
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
    tickPlacement: 'between',
    labels: {
      formatter: value => (value).toFixed(2),
      style: {
        fontSize: '9px'
      }
    }
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
      minWidth: 50,
      maxWidth: 50
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
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
};

export const defaultMissChart1Options = {
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
  colors: ["#cccccc"],
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
    tickPlacement: 'between',
    position: 'bottom',
    labels: {
      minHeight: 80,
      maxHeight: 80,
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: false,
    }
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
      minWidth: 50,
      maxWidth: 50,
      formatter: value => `${(value * 100).toFixed(0)} %`
    }
  },
  tooltip: {
    y: {
      formatter: value => `${(value * 100).toFixed(2)} %`
    }
  },
  grid: {
    yaxis: {
      lines: {
        show: false
      }
    },
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
};

export const defaultMissChart2Options = {
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
    labels: {
      minHeight: 80,
      maxHeight: 80,
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: false,
    },
    floating: false
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
      show: false,
      rotateAlways: false,
      hideOverlappingLabels: false,
    }
  },
  legend: {
    show: false,
  },
  tooltip: {
    y: {
      formatter: value => value === 1 ? 'Present' : 'Missing'
    }
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
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
};

export const defaultMissChart3Options = {
  chart: {
    stacked: true,
    parentHeightOffset: 0
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    reversed: true,
    labels: {
      show: false,
      minHeight: 52,
      maxHeight: 52,
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: false,
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
    reversed: false,
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
  tooltip: {
    y: {
      formatter: value => `${(value * 100).toFixed(2)} %`
    }
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.15,
      }
    }
  }
};

export const defaultMissChart4Options = {
  chart: {
    dropShadow: {
      enabled: false
    },
    parentHeightOffset: 0
  },
  xaxis: {
    // categories: [1999, 2000, 2001, 2002, 2003],
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
    },
    labels: {
      minWidth: 50,
      maxWidth: 50,
      formatter: value => `${(value * 100).toFixed(0)} %`
    }
  },
  tooltip: {
    y: {
      formatter: value => `${(value * 100).toFixed(2)} %`
    }
  }
};

export const defaultRepDelChartOptions = {
  chart: {
    parentHeightOffset: 15
  },
  dataLabels: {
    enabled: false
  },
  annotations: {
    xaxis: [{
      borderColor: '#69b023',
      strokeDashArray: 0,
      label: {
        orientation: 'horizontal',
        textAnchor: 'start',
        borderColor: '#69b023',
        style: {
          color: 'white',
          background: '#69b023'
        }
      }
    }]
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  xaxis: {
    type: 'numeric',
    categories: [0, 10, 20, 30, 40, 50, 60],
    title: {
      text: 'Notification time in quarters of the year',
      style: {
        fontWeight: 'normal'
      },
      offsetY: 10
    },
    tickPlacement: 'on',
    tickAmount: 20,
    labels: {
      formatter: value => (value).toFixed(2)
    }
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
    labels: {
      minWidth: 50,
      maxWidth: 50,
      formatter: value => (value).toFixed(2)
    }
  }
};

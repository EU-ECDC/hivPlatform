import React from 'react';
import { observer } from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendPlainComponent,
  DatasetComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendPlainComponent,
  DatasetComponent,
  LineChart,
  SVGRenderer
]);

const HIVChart = () => {

  const dataSet = {
    source: {
      'Year': [1980, 1981, 1982, 1983, 1984, 1985, 1986],
      'Mean min': [730, 832, 821, 824, 1000, 1030, 1020],
      'Mean range': [100, 150, 200, 200, 300, 340, 370],
      'Mean': [800, 900, 900, 910, 1050, 1100, 1100],
      'Data': [680, 772, 751, 774, 1000, 1130, 1220]
    }
  };

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 20, bottom: 40, left: 60 },
    title: {
      text: 'A. HIV diagnoses, total'
    },
    dataset: dataSet,
    xAxis: {
      type: 'category',
      nameLocation: 'center',
      nameTextStyle: {
        padding: [10, 0, 0, 0],
      },
      axisTick: {
        alignWithLabel: true
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameLocation: 'center',
      nameGap: 45
    },
    series: [
      {
        type: 'line',
        stack: 'confidence-bounds',
        symbol: 'none',
        silent: true,
        color: '#eee',
        lineStyle: {
          width: 0,
        },
        emphasis: {
          areaStyle: {
            color: '#eee'
          },
          lineStyle: {
            width: 0,
          }
        },
      },
      {
        type: 'line',
        silent: true,
        areaStyle: {
          color: '#eee'
        },
        emphasis: {
          areaStyle: {
            color: '#eee'
          },
          lineStyle: {
            width: 0,
          }
        },
        color: '#eee',
        lineStyle: {
          width: 0,
        },
        stack: 'confidence-bounds',
        symbol: 'none',
        smooth: true,
      },
      {
        type: 'line',
        smooth: true,
        color: '#bbb',
        lineStyle: {
          type: 'dashed',
        },
        emphasis: {
          scale: false,
          focus: 'none',
          lineStyle: {
            width: 2,
            color: '#888',
          }
        }
      },
      {
        type: 'line',
        smooth: true,
        color: '#69b023',
      },
    ],
    tooltip: {
      trigger: 'axis',
      // formatter: (params) => {
      //   return `
      //     Year: ${params[0].axisValue}<br/ >
      //     ${params[0].seriesName}: ${params[0].value}<br />
      //     ${params[1].seriesName}: ${params[1].value} (${params[2].value}, ${params[2].value + params[3].value})<br />
      //   `
      // }
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        saveAsImage: {
          pixelRatio: 2,
          title: 'Save'
        }
      }
    },
    legend: {
      data: [
        { name: 'Data' },
        { name: 'Mean' },
        { name: 'Mean range' }
      ]
    }
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={options}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default observer(HIVChart);

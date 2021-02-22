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
  LegendPlainComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import FormatPercentage from '../utilities/FormatPercentage';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendPlainComponent,
  LineChart,
  SVGRenderer
]);

const AreaChart = (props) => {

  const { yLabelName, xCategories, data } = props;

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 120, bottom: 40, left: 60 },
    xAxis: {
      type: 'category',
      name: 'Diagnosis year',
      data: xCategories,
      nameLocation: 'center',
      nameTextStyle: {
        padding: [10, 0, 0, 0],
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: yLabelName,
      nameLocation: 'center',
      nameGap: 45,
      axisLabel: {
        formatter: (val) => FormatPercentage(val, 0)
      }
    },
    series: [
      {
        name: data[0].name,
        type: 'line',
        data: data[0].data,
      },
      {
        name: data[1].name,
        type: 'line',
        data: data[1].data,
      },
      {
        name: data[2].name,
        type: 'line',
        data: data[2].data,
      },
      {
        name: data[3].name,
        type: 'line',
        data: data[3].data,
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
        dataZoom: { },
        restore: {},
        saveAsImage: { pixelRatio: 2 },
      },
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle'
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

export default observer(AreaChart);

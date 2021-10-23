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
import FormatPercentage from '../../utilities/FormatPercentage';

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

  const { yLabelName, xCategories, data, options } = props;

  const defaultOptions = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 15, bottom: 40, left: 60 },
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
      formatter: (params) =>
        `
          Year: ${params[0].axisValue}<br/ >
          ${params.map(el => `${el.marker} ${el.seriesName}: ${FormatPercentage(el.value, 2)}`).join('<br />')}
        `
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: { },
        restore: {},
        saveAsImage: {
          pixelRatio: 2,
          name: 'MissingnessDistribution',
          title: 'Save'
        },
      },
    },
    legend: {
    }
  };

  const finalOptions = Object.assign({}, defaultOptions, options);

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={finalOptions}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default observer(AreaChart);

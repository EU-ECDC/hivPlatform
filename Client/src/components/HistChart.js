import React from 'react';
import { observer } from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  DatasetComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  DatasetComponent,
  BarChart,
  SVGRenderer
]);

const HistChart = () => {

  const dataSet = {
    source: {
      'Year': [1980, 1981, 1982, 1983, 1984, 1985, 1986],
      'Male': [730, 832, 821, 824, 1000, 1030, 1020],
      'Female': [100, 150, 200, 200, 300, 340, 370]
    }
  };

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 90, bottom: 40, left: 60 },
    dataset: dataSet,
    xAxis: {
      type: 'category',
      name: 'Year',
      nameLocation: 'center',
      nameTextStyle: {
        padding: [10, 0, 0, 0],
      },
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameLocation: 'center',
      nameGap: 45
    },
    series: [
      {
        type: 'bar',
        stack: true,
        barCategoryGap: 1,
        color: '#69b023'
      },
      {
        type: 'bar',
        stack: true,
        barCategoryGap: 1,
        color: '#7bbcc0'
      },
    ],
    tooltip: {
      trigger: 'axis',
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

export default observer(HistChart);

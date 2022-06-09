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
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import IsNull from '../../utilities/IsNull';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendPlainComponent,
  LineChart,
  SVGRenderer
]);

const HIVChart = ({
  title,
  xAxisTitle = 'Year',
  yAxisName = 'Count',
  data,
}) => {
  let legendData = [];
  let series = [];
  let selected = {};

  const AddSeries = s => {
    if (!IsNull(s)) {
      if (!IsNull(s.data)) {
        series.push({
          name: s.name,
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 4,
          data: s.data,
        });
        legendData.push({
          name: s.name
        });
        selected[s.name] = series.length === 1
      }
    }
  }

  data.forEach(s => AddSeries(s));

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 20, bottom: 40, left: 80 },
    title: {
      text: title
    },
    xAxis: {
      type: 'category',
      nameLocation: 'center',
      name: xAxisTitle,
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
      name: yAxisName,
      nameLocation: 'center',
      nameGap: 65
    },
    series: series,
    tooltip: {
      trigger: 'axis',
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
      data: legendData,
      textStyle: {
        fontSize: 11
      }
    }
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={options}
      style={{ height: '300px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default observer(HIVChart);

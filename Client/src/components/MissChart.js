import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  VisualMapComponent,
  VisualMapPiecewiseComponent,
  DatasetComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import FormatPercentage from '../utilities/FormatPercentage';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  DatasetComponent,
  VisualMapComponent,
  VisualMapPiecewiseComponent,
  BarChart,
  HeatmapChart,
  SVGRenderer
]);

const MissChart = (props) => {

  const { xCategories, data1, data2, data3 } = props;

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: [
      { left: 15, width: '30%', height: '347px', containLabel: true },
      { left: 'center', width: '30%', height: '347px', containLabel: true },
      { right: 15, width: '30%', height: '300px', containLabel: true }
    ],
    xAxis: [
      {
        gridIndex: 0,
        type: 'category',
        data: xCategories,
        axisLabel: {
          rotate: 45
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      {
        gridIndex: 1,
        type: 'category',
        data: xCategories,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 45
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      {
        gridIndex: 2,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          formatter: (val) => FormatPercentage(val, 0)
        }
      },
    ],
    yAxis: [
      {
        id: 'test',
        gridIndex: 0,
        name: 'Relative frequency of missing data',
        nameTextStyle: {
          align: 'left'
        },
        nameLocation: 'end',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          formatter: (val) => FormatPercentage(val, 0)
        }
      },
      {
        gridIndex: 1,
        type: 'category',
        name: 'Missing data pattern',
        nameTextStyle: {
          align: 'left'
        },
        nameLocation: 'end',
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      {
        gridIndex: 2,
        type: 'category', axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }

      },
    ],
    visualMap: {
      type: 'piecewise',
      seriesIndex: 1,
      min: 0,
      max: 1,
      pieces: [
        { min: 0, max: 0.9999999, color: '#ddd' },
        { min: 0.9999999, color: '#69b023' }
      ],
      show: false
    },
    series: [
      {
        type: 'bar',
        barCategoryGap: 1,
        color: '#cccccc',
        data: data1,
        xAxisIndex: 0,
        yAxisIndex: 0,
        visualMap: false
      },
      {
        type: 'heatmap',
        data: data2,
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        }
      },
      {
        name: 'Present',
        type: 'bar',
        data: data3[0],
        xAxisIndex: 2,
        yAxisIndex: 2,
        barCategoryGap: 1,
        color: '#69b023',
        stack: 'test',
      },
      {
        name: 'Missing',
        type: 'bar',
        data: data3[1],
        xAxisIndex: 2,
        yAxisIndex: 2,
        barCategoryGap: 1,
        color: '#ccc',
        stack: 'test',
      }
    ],
    tooltip: {
      trigger: 'item',
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        saveAsImage: {
          pixelRatio: 2
        }
      }
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
      style={{ height: '400px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default MissChart;

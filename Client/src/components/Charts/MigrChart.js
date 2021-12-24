import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendPlainComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import IsNull from '../../utilities/IsNull';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  VisualMapComponent,
  HeatmapChart,
  SVGRenderer
]);

const MigrChart = (props) => {

  const { data, options } = props;

  if (IsNull(data)) {
    return(<div>No plot data available</div>)
  }

  const height = data.chartCategoriesY.length * 18 + 110;

  const defaultOptions = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 50, right: 70, bottom: 40, left: 90 },
    xAxis: {
      type: 'category',
      name: data.titleX,
      nameLocation: 'center',
      nameGap: 35,
      data: data.chartCategoriesX,
      position: 'top',
      axisLabel: {
        fontSize: 11
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      name: 'Year of Arrival',
      nameLocation: 'center',
      nameGap: 45,
      data: data.chartCategoriesY,
      inverse: false,
      axisLabel: {
        fontSize: 11
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    visualMap: {
      type: 'continuous',
      calculable: true,
      orient: 'vertical',
      left: 'right',
      top: 'top',
      inRange: {
        color: ['#bedfe1', '#69b023']
      },
      padding: [40, 0],
      min: 0,
      max: data.dataMax,
      align: 'left',
      itemHeight: 100
    },
    series: [{
      type: 'heatmap',
      data: data.seriesData,
      label: {
        show: true
      },
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
    }],
    tooltip: {
      trigger: 'item'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        saveAsImage: {
          pixelRatio: 2,
          name: 'MissingnessPattern',
          title: 'Save'
        }
      }
    },
    legend: {}
  };

  const finalOptions = Object.assign({}, defaultOptions, options);

  return(<ReactEchartsCore
      echarts={echarts}
      option={finalOptions}
      style={{ height: `${height}px`, width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default MigrChart;

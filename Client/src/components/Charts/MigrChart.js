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
  DataZoomComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import IsNull from '../../utilities/IsNull';
import MergeObjects from '../../utilities/MergeObjects';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  VisualMapComponent,
  DataZoomComponent,
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
    grid: { top: 70, right: 0, bottom: 40, left: 90 },
    xAxis: {
      type: 'category',
      name: data.titleX,
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold'
      },
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
      orient: 'horizontal',
      right: 80,
      top: 'top',
      inRange: {
        // color: ['#bedfe1', '#69b023']
        color: ['blue', 'red']
      },
      padding: 0,
      min: 0,
      max: data.dataMax,
      align: 'top',
      textStyle: {
        fontSize: 11,
        color: 'rgb(110, 112, 121)'
      }
    },
    series: [{
      type: 'heatmap',
      data: data.seriesData,
      label: {
        show: true,
        fontSize: 10
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

  const finalOptions = MergeObjects(defaultOptions, options);

  return(<ReactEchartsCore
      echarts={echarts}
      option={finalOptions }
      style={{ height: `${height}px`, width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
    />
  );
};

export default MigrChart;

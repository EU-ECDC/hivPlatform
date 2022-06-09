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

const HIVChart = ({ title, yAxisName = 'Count', year, data, dataNotUsed = null, model, min, range }) => {

  let legendData = [];
  let series = [];

  if (!IsNull(min)) {
    series.push({
      name: 'Min',
      data: min,
      type: 'line',
      stack: 'confidence-bounds',
      symbol: 'none',
      silent: true,
      color: '#69b023',
      lineStyle: {
        width: 0,
      },
      emphasis: {
        areaStyle: {
          color: '#69b023'
        },
        lineStyle: {
          width: 0,
        }
      },
    });
  }

  if (!IsNull(range)) {
    series.push({
      name: 'Confidence bounds',
      data: range,
      type: 'line',
      silent: true,
      areaStyle: {
        color: '#69b023',
        opacity: 0.15
      },
      emphasis: {
        areaStyle: {
          color: '#69b023'
        },
        lineStyle: {
          width: 0,
        }
      },
      color: '#69b023',
      lineStyle: {
        width: 0,
      },
      stack: 'confidence-bounds',
      symbol: 'none',
      smooth: false,
    });
  }

  if (!IsNull(model)) {
    series.push({
      name: 'Model',
      type: 'line',
      smooth: false,
      symbol: 'none',
      symbolSize: 4,
      color: 'silver',
      lineStyle: {
        type: 'dotted',
      },
      data: model,
      // emphasis: {
      //   scale: false,
      //   focus: 'none',
      //   lineStyle: {
      //     width: 2,
      //     color: '#69b023',
      //   }
      // }
    });
  }

  if (!IsNull(data)) {
    series.push({
      name: 'Data used',
      type: 'line',
      data: data,
      lineStyle: {
        type: 'solid',
      },
      symbol: 'none',
      symbolSize: 4,
      // emphasis: {
      //   scale: false,
      //   focus: 'none',
      //   lineStyle: {
      //     width: 2,
      //     color: '#000',
      //   }
      // },
      smooth: false,
      color: '#69b023',
    });
    legendData.push({ name: 'Data used' });
  }


  if (!IsNull(data)) {
    series.push({
      name: 'Data NOT used',
      type: 'line',
      data: data,
      lineStyle: {
        type: 'dotted',
      },
      symbol: 'none',
      symbolSize: 4,
      // emphasis: {
      //   scale: false,
      //   focus: 'none',
      //   lineStyle: {
      //     width: 2,
      //     color: '#000',
      //   }
      // },
      smooth: false,
      color: '#69b023',
    });
    legendData.push({ name: 'Data NOT used' });
  }

  if (!IsNull(model)) {
    legendData.push({ name: 'Model' });
  }

  if (!IsNull(range)) {
    legendData.push({ name: 'Confidence bounds' });
  }


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
      data: year,
      name: 'Year',
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
      trigger: 'axis'
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
      data: legendData
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

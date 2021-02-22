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
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  BarChart,
  SVGRenderer
]);

const HistChart = (props) => {

  const echart = React.useRef(null);

  const { xAxisLabel, xCategories, maleData, femaleData } = props;

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 90, bottom: 40, left: 60 },
    xAxis: {
      type: 'category',
      name: xAxisLabel,
      data: xCategories,
      nameLocation: 'center',
      nameTextStyle: {
        padding: [10, 0, 0, 0],
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameLocation: 'center',
      nameGap: 45,
      splitLine: { show: false }
    },
    series: [
      {
        name: 'Male',
        data: maleData,
        type: 'bar',
        stack: true,
        barCategoryGap: 1,
        color: '#69b023',
      },
      {
        name: 'Female',
        data: femaleData,
        type: 'bar',
        stack: true,
        barCategoryGap: 1,
        color: '#7bbcc0',
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5;
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle'
    }
  };

  // React.useEffect(
  //   () => {
  //     let echartInstance = echart.current.getEchartsInstance();
  //     setTimeout(() => {
  //       echartInstance.clear();
  //       echartInstance.setOption(options);
  //     }, 1000);
  //   }
  // );

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={options}
      style={{ height: '200px', width: '100%' }}
      notMerge={true}
      lazyUpdate={true}
      opts={{}}
      ref={echart}
    />
  );
};

export default observer(HistChart);

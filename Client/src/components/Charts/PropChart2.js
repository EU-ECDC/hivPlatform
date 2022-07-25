import React from 'react';
import { observer } from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
// import ClipperLib from 'clipper-lib';
import {
  LineChart,
  CustomChart
} from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
} from 'echarts/components';
import {
  CanvasRenderer
} from 'echarts/renderers';
import IsNull from '../../utilities/IsNull';
import FormatPercentage from '../../utilities/FormatPercentage';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendPlainComponent,
  LineChart,
  CustomChart,
  CanvasRenderer
]);

const PropChart2 = ({
  title,
  xAxisTitle = 'Year',
  yAxisTitle = 'Proportion',
  data
}) => {

  const SanitizeData = (seriesData) => {
    let sanitizedData = null;
    if (!IsNull(seriesData)) {
      sanitizedData = seriesData.map(el => {
        if (!isFinite(el[1])) {
          el[1] = el[2]
        }
        if (!isFinite(el[3])) {
          el[3] = el[2]
        }

        return (el)
      });
    }

    return sanitizedData;
  };

  const RenderItem = (params, api) => {
    if (params.context.rendered) {
      return;
    }

    const firstCategoryIndex = api.value(0, params.dataIndexInside);
    const secondCategoryIndex = api.value(0, params.dataIndexInside + 1);
    const firstValue = api.value(2, params.dataIndexInside);
    const secondValue = api.value(2, params.dataIndexInside + 1);
    const coord1 = api.coord([firstCategoryIndex, firstValue]);
    const coord2 = api.coord([secondCategoryIndex, secondValue]);
    const linePoints = {
      x1: coord1[0],
      y1: coord1[1],
      x2: coord2[0],
      y2: coord2[1],
    }

    const coordLeftBottom = api.coord([firstCategoryIndex, api.value(1, params.dataIndexInside)]);
    const coordLeftTop = api.coord([firstCategoryIndex, api.value(3, params.dataIndexInside)]);
    const coordRightTop = api.coord([firstCategoryIndex + 1, api.value(3, params.dataIndexInside + 1)]);
    const coordRightBottom = api.coord([firstCategoryIndex + 1, api.value(1, params.dataIndexInside + 1)]);
    const boundPoints = [
      coordLeftBottom, coordLeftTop, coordRightTop, coordRightBottom
    ]

    const color = api.visual('color');

    return {
      type: 'group',
      children: [
        {
          type: 'polygon',
          shape: {
            points: boundPoints
          },
          style: {
            fill: color,
            opacity: 0.3
          }
        },
        {
          type: 'line',
          shape: linePoints,
          style: {
            stroke: color,
            fill: 'none'
          }
        },
      ]
    };
  };

  let legendData = [];
  let series = [];
  let selected = {};

  const AddSeries = s => {
    if (!IsNull(s)) {
      legendData.push({
        name: s.name
      });

      series.push({
        name: s.name,
        type: 'custom',
        data: SanitizeData(s.values),
        renderItem: RenderItem,
      });

      selected[s.name] = series.length === 1
    }
  }

  data.forEach(s => AddSeries(s));

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 240, bottom: 40, left: 65 },
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
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: yAxisTitle,
      nameLocation: 'center',
      nameGap: 50,
      axisLabel: {
        formatter: val => FormatPercentage(val, 0)
      },
      min: 0,
      max: 1
    },
    series: series,
    tooltip: {
      trigger: 'axis',
      formatter: params =>
        (`
          Year: ${params[0].axisValue}<br/ >
          ${params.map(el => `${el.marker} ${el.seriesName}: ${FormatPercentage(el.value[2], 0)} (${FormatPercentage(el.value[1], 0)} - ${FormatPercentage(el.value[3], 0)})`).join('<br />')}
        `)
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
      orient: 'vertical',
      right: 0,
      top: 'center',
      selector: true,
      selected: selected,
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

export default observer(PropChart2);

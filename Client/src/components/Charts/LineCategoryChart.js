import React from 'react';
import { observer } from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
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

const LineCategoryChart = ({
  title,
  xAxisTitle = 'Year',
  yAxisTitle = 'Proportion',
  data
}) => {

  const SanitizeData = (seriesData) => {
    let sanitizedData = null;
    if (!IsNull(seriesData)) {
      sanitizedData = seriesData.map(el => {
        // If main value is not finite then no confidence bounds
        if (!isFinite(el[1])) {
          return([el[0], null, null, null])
        }
        // If lower bound is not finite, then main value is the lower bound
        if (!isFinite(el[2])) {
          el[2] = el[1]
        }
        // If upper bound is not finite, then main value is the uper bound
        if (!isFinite(el[3])) {
          el[3] = el[1]
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

    const color = api.visual('color');

    const dataIdx = params.dataIndexInside;
    const firstCategoryIndex = api.value(0, dataIdx);
    const firstValue = api.value(1, dataIdx);
    const coordStart = api.coord([firstCategoryIndex, firstValue]);
    const secondCategoryIndex = api.value(0, dataIdx + 1);
    const secondValue = api.value(1, dataIdx + 1);
    const coordEnd = api.coord([secondCategoryIndex, secondValue]);

    const linePoints = {
      x1: coordStart[0],
      y1: coordStart[1],
      x2: coordEnd[0],
      y2: coordEnd[1],
    }

    const coordLeftBottom = api.coord([firstCategoryIndex, api.value(2, dataIdx)]);
    const coordLeftTop = api.coord([firstCategoryIndex, api.value(3, dataIdx)]);
    const coordRightTop = api.coord([secondCategoryIndex, api.value(3, dataIdx + 1)]);
    const coordRightBottom = api.coord([secondCategoryIndex, api.value(2, dataIdx + 1)]);
    const boundPoints = [
      coordLeftBottom, coordLeftTop, coordRightTop, coordRightBottom
    ]

    let children = [];
    // Add confidence bound as first elements at the bottom of the stack
    if (coordLeftBottom !== coordLeftTop && coordRightBottom !== coordRightTop) {
      children.push({
        type: 'polygon',
        shape: {
          points: boundPoints
        },
        style: {
          fill: color,
          opacity: 0.3
        }
      })
    }
    // Add main value line
    children.push({
      type: 'line',
      shape: linePoints,
      style: {
        stroke: color,
        fill: 'none',
        lineDash: api.value(4, dataIdx) === 'dotted' ? [2] : null
      }
    })
    // Add main value circle
    children.push({
      type: 'circle',
      shape: {
        cx: coordStart[0],
        cy: coordStart[1],
        r: 2
      },
      style: {
        fill: color
      }
    })

    return {
      type: 'group',
      children: children
    };
  };

  let legendData = [];
  let series = [];
  let selected = {};

  const AddSeries = s => {
    if (!IsNull(s)) {
      series.push({
        name: s.name,
        type: 'custom',
        data: SanitizeData(s.values),
        renderItem: RenderItem,
      });

      legendData.push({
        name: s.name
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
      boundaryGap: false,
      axisPointer: {
        type: 'shadow',
        snap: true
      }
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
          ${params.map(el => `${el.marker} ${el.seriesName}: ${FormatPercentage(el.value[1], 0)} (${FormatPercentage(el.value[2], 0)} - ${FormatPercentage(el.value[3], 0)})`).join('<br />')}
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

export default observer(LineCategoryChart);

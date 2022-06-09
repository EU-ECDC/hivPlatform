import React from 'react';
import { observer } from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import ClipperLib from 'clipper-lib';
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

  const chartRef = React.useRef(null);

  // https://stackoverflow.com/questions/61724715/echarts-plot-the-variance-of-signals
  const CalcContourCoords = (seriesData, ctx) => {
    console.log(seriesData);
    const pixelCoords = []

    for (let i = 0; i < seriesData[0].length; i++) {
      pixelCoords.push([
        ctx.convertToPixel({ xAxisIndex: 0 }, i),
        ctx.convertToPixel({ yAxisIndex: 0 }, seriesData[1][i])
      ]);
    }

    for (let i = seriesData[0].length - 1; i >= 0; i--) {
      pixelCoords.push([
        ctx.convertToPixel({ xAxisIndex: 0 }, i),
        ctx.convertToPixel({ yAxisIndex: 0 }, seriesData[0][i])
      ]);

      if (i == 0) {
        pixelCoords.push([
          ctx.convertToPixel({ xAxisIndex: 0 }, i),
          ctx.convertToPixel({ yAxisIndex: 0 }, seriesData[1][i])
        ]);
      }
    }

    var linePath = new ClipperLib.Path();

    var delta = 10;
    var scale = 1;

    for (var i = 0; i < pixelCoords.length; i++) {
      var point = new ClipperLib.IntPoint(...pixelCoords[i]);
      linePath.push(point);
    }

    var co = new ClipperLib.ClipperOffset(1.0, 0.25);
    co.AddPath(linePath, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
    co.Execute(linePath, delta * scale);

    return co.m_destPoly.map(c => [c.X, c.Y])
  }

  // Render visual by calculated coords
  const RenderItem = (params, api) => {
    console.log('here');
    const myChart = chartRef.current.getEchartsInstance();

    // Prevent multiple call
    if (params.context.rendered) return;
    params.context.rendered = true;

    // Get stored in series data for band
    const series = myChart.getModel().getSeriesByName(params.seriesName)[0];
    const seriesData = series.get('data');

    // Calculate band coordinates for series
    let bandCoords = CalcContourCoords(seriesData, myChart);

    // Draw band
    return {
      type: 'polygon',
      shape: {
        points: echarts.graphic.clipPointsByRect(bandCoords, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        })
      },
      style: {
        fill: api.style({
          fill: series.option.itemStyle.color
        })
      }
    };
  }

  const onChartLegendselectchanged = e => {
    console.log(e);
  };

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
          // color: s.color,
          data: s.data,
          // emphasis: { scale: false, focus: 'none', lineStyle: { width: 2, color: s.color } },
        });
        legendData.push({
          name: s.name
        });
        selected[s.name] = series.length === 1
      }

      // if (!IsNull(s.min) && !IsNull(s.max)) {
      //   console.log('here');
      //   series.push({
      //     name: `${s.name} - Confidence bounds`,
      //     type: 'custom',
      //     data: [s.min, s.max],
      //     renderItem: RenderItem,
      //     // symbol: 'none',
      //     // silent: true,
      //     // color: s.color,
      //     // lineStyle: { width: 0 },
      //     // itemStyle: { color: s.color },
      //     // emphasis: { areaStyle: { color: s.color }, lineStyle: { width: 0 } },
      //     xAxisIndex: xAxis.length - 1,
      //     yAxisIndex: 0
      //   });
      // }
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
      }
    },
    series: series,
    tooltip: {
      trigger: 'axis',
      formatter: params =>
        `
          Year: ${params[0].axisValue}<br/ >
          ${params.map(el => `${el.marker} ${el.seriesName}: ${FormatPercentage(el.value[1], 0)}`).join('<br />')}
        `
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
      // onEvents={{
      //   'legendselectchanged': onChartLegendselectchanged
      // }}
      ref={chartRef}
    />
  );
};

export default observer(PropChart2);

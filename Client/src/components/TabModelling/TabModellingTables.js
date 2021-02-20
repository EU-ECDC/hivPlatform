import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TabPanel from '../TabPanel';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  LegendPlainComponent,
} from 'echarts/components';
import { CanvasRenderer} from 'echarts/renderers';

echarts.use([
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  LegendPlainComponent,
  LineChart,
  CanvasRenderer
]);

const TabModellingTables = props => {

  const options = {
    textStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    grid: { top: 40, right: 20, bottom: 40, left: 60 },
    title: {
      text: 'A. HIV diagnoses, total'
    },
    xAxis: {
      type: 'category',
      data: [1980, 1981, 1982, 1983, 1984, 1985, 1986],
      name: 'Year',
      nameLocation: 'center',
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
      name: 'Count',
      nameLocation: 'center',
      nameGap: 45
    },
    series: [
      {
        data: [680, 772, 751, 774, 1000, 1130, 1220],
        type: 'line',
        name: 'Data',
        smooth: true,
        color: '#69b023',
      },
      {
        data: [800, 900, 900, 910, 1050, 1100, 1100],
        type: 'line',
        name: 'Mean',
        smooth: true,
        color: '#bbb',
        lineStyle: {
          type: 'dashed',
        },
        emphasis: {
          scale: false,
          focus: 'none',
          lineStyle: {
            width: 2,
            color: '#aaa',
          }
        }
      },
      {
        name: 'Mean-min',
        type: 'line',
        data: [ 730, 832, 821, 824, 1000, 1030, 1020 ],
        stack: 'confidence-bounds',
        symbol: 'none',
        silent: true,
        color: '#e0e0e0',
        lineStyle: {
          width: 1,
        },
        smooth: true,
      },
      {
        name: 'Mean min-max',
        type: 'line',
        data: [100, 150, 200, 200, 300, 340, 370],
        silent: true,
        areaStyle: {
          color: '#eee'
        },
        emphasis: {
          areaStyle: {
            color: '#eee'
          },
        },
        color: '#e0e0e0',
        lineStyle: {
          width: 1,
        },
        stack: 'confidence-bounds',
        symbol: 'none',
        smooth: true,
      },
    ],
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
          pixelRatio: 2
        }
      }
    },
    legend: {
      data: [
        { name: 'Data' },
        { name: 'Mean' },
        { name: 'Mean min-max' }
      ]
    }
  };

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(5);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            HIV Modelling results
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <RadioGroup
              name='repDelDataSelection'
              defaultValue='INDIVIDUAL'
            >
              <FormControlLabel
                value='INDIVIDUAL'
                control={<Radio color='primary' size='small' />}
                label='Individual'
              />
              <FormControlLabel
                value='COMBINED'
                control={<Radio color='primary' size='small' />}
                label='Combined'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <ReactEchartsCore
              echarts={echarts}
              option={options}
              notMerge={true}
              lazyUpdate={true}
              // theme='light'
              opts={{}}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingTables);

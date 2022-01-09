import React from 'react';
import { observer } from 'mobx-react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import IsNull from '../../utilities/IsNull';
import Title from '../Title';
import MigrChart from '../Charts/MigrChart';

const YODDistr = (props) => {

  const { migrMgr } = props;

  const handleYodRegionChange = (e, value) => migrMgr.setYodRegion(value);

  const endValue = !IsNull(migrMgr.yodDistr) ? migrMgr.yodDistr.chartCategoriesX.length - 1 : 0;
  const startValue = Math.max(endValue - 20 + 1, 0);
  let regionButtons = null;
  if (!IsNull(migrMgr.yodDistr)) {
    regionButtons =
      <ToggleButtonGroup
        exclusive
        size='small'
        color='primary'
        value={migrMgr.yodRegion}
        onChange={handleYodRegionChange}
      >
        <ToggleButton value='All'>All</ToggleButton>
        <ToggleButton value='Africa'>Africa</ToggleButton>
        <ToggleButton value='Europe-North America'>Europe-North America</ToggleButton>
        <ToggleButton value='Asia'>Asia</ToggleButton>
        <ToggleButton value='Other'>Other</ToggleButton>
      </ToggleButtonGroup>;
  }

  return (
    <React.Fragment>
      <Title>Figure 2. Average number of cases by the Year of Arrival and Year of Diagnosis</Title>
      {regionButtons}
      <MigrChart
        data={migrMgr.yodDistr}
        options={{
          xAxis: {
            inverse: true,
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              bottom: 10,
              startValue: startValue,
              endValue: endValue,
              handleSize: '80%',
              showDetail: true
            }
          ]
        }}
      />
    </React.Fragment>
  )
};

export default observer(YODDistr);

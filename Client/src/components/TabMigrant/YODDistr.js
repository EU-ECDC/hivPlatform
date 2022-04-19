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
        <ToggleButton value='ALL'>ALL</ToggleButton>
        <ToggleButton value='AFRICA'>AFRICA</ToggleButton>
        <ToggleButton value='EUROPE-NORTH AMERICA'>EUROPE-NORTH AMERICA</ToggleButton>
        <ToggleButton value='ASIA'>ASIA</ToggleButton>
        <ToggleButton value='OTHER'>OTHER</ToggleButton>
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
      Last 20 years selected by default.
    </React.Fragment>
  )
};

export default observer(YODDistr);

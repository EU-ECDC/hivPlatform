import React from 'react';
import { observer } from 'mobx-react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Title from '../Title';
import LineCategoryChart from '../Charts/LineCategoryChart';
import IsNull from '../../utilities/IsNull';

const PropCharts = ({migrMgr}) => {
  const { arrivalPlotData, diagnosisPlotData } = migrMgr;

  const handleShowConfBoundsChange = e => migrMgr.setShowConfBounds(e.target.checked);

  let arrivalPlot = null;
  if (IsNull(arrivalPlotData)) {
    arrivalPlot = <div>No plot data available</div>
  } else {
    arrivalPlot =
      <LineCategoryChart
        xAxisTitle='Year of Arrival'
        data={arrivalPlotData}
        format='percentage'
        showConfBounds={migrMgr.showConfBounds}
      />
  }

  let diagnosisPlot = null;
  if (IsNull(diagnosisPlotData)) {
    diagnosisPlot = <div>No plot data available</div>
  } else {
    diagnosisPlot =
     <LineCategoryChart
        xAxisTitle='Year of Diagnosis'
        data={diagnosisPlotData}
        format='percentage'
        showConfBounds={migrMgr.showConfBounds}
      />
  }

  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Switch
            checked={migrMgr.showConfBounds}
            onChange={handleShowConfBoundsChange}
            color='primary'
            size='small'
          />
        }
        label='Show confidence bounds'
        sx={{ marginTop: 1, marginBottom: 1}}
      />
      <Title>
        Figure 3. Proportion of migrants infected post arrival by region of origin and year of arrival
      </Title>
      {arrivalPlot}

      <Title
        sx={{ marginTop: 1 }}
      >
        Figure 4. Proportion of migrants infected post arrival by region of origin and year of diagnosis
      </Title>
      {diagnosisPlot}
    </React.Fragment>
  )
};

export default observer(PropCharts);

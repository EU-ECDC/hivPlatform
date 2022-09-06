import React from 'react';
import { observer } from 'mobx-react';
import Title from '../Title';
import LineCategoryChart from '../Charts/LineCategoryChart';
import IsNull from '../../utilities/IsNull';

const PropCharts = ({migrMgr}) => {
  const { arrivalPlotData, diagnosisPlotData } = migrMgr;

  let arrivalPlot = null;
  if (IsNull(arrivalPlotData)) {
    arrivalPlot = <div>No plot data available</div>
  } else {
    arrivalPlot =
      <LineCategoryChart
        xAxisTitle='Year of Arrival'
        data={arrivalPlotData}
        format='percentage'
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
      />
  }

  return (
    <React.Fragment>
      <Title
        sx={{ marginTop: '30px' }}
      >
        Figure 3. Proportion of migrants infected post arrival by region of origin and year of arrival
      </Title>
      {arrivalPlot}

      <Title
        sx={{ marginTop: '30px' }}
      >
        Figure 4. Proportion of migrants infected post arrival by region of origin and year of diagnosis
      </Title>
      {diagnosisPlot}
    </React.Fragment>
  )
};

export default observer(PropCharts);

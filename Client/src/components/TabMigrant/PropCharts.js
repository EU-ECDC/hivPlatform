import React from 'react';
import { observer } from 'mobx-react';
import Title from '../Title';
// import PropChart from '../Charts/PropChart';
import PropChart2 from '../Charts/PropChart2';
import IsNull from '../../utilities/IsNull';

const PropCharts = ({migrMgr}) => {
  const { arrivalPlotData, diagnosisPlotData } = migrMgr;

  let arrivalPlot = null;
  if (IsNull(arrivalPlotData)) {
    arrivalPlot = <div>No plot data available</div>
  } else {
    arrivalPlot =
      <PropChart2
        xAxisTitle='Year of Arrival'
        data={arrivalPlotData}
      />
  }

  let diagnosisPlot = null;
  if (IsNull(diagnosisPlotData)) {
    diagnosisPlot = <div>No plot data available</div>
  } else {
    diagnosisPlot =
     <PropChart2
        xAxisTitle='Year of Diagnosis'
        data={diagnosisPlotData}
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

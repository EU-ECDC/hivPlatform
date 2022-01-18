import React from 'react';
import { observer } from 'mobx-react';
import Title from '../Title';
import PropChart from '../Charts/PropChart';
import IsNull from '../../utilities/IsNull';

const PropCharts = ({migrMgr}) => {
  const { arrivalPlotData, diagnosisPlotData } = migrMgr;

  let arrivalPlot = null;
  if (IsNull(arrivalPlotData)) {
    arrivalPlot = <div>No plot data available</div>
  } else {
    arrivalPlot =
      <PropChart
        xAxisTitle='Year of Arrival'
        year={arrivalPlotData.Year}
        data={arrivalPlotData.PostProp}
        min={arrivalPlotData.PostPropLB}
        range={arrivalPlotData.PostPropRange}
      />
  }

  let diagnosisPlot = null;
  if (IsNull(diagnosisPlotData)) {
    diagnosisPlot = <div>No plot data available</div>
  } else {
    diagnosisPlot =
      <PropChart
        xAxisTitle='Year of HIV Diagnosis'
        year={diagnosisPlotData.Year}
        data={diagnosisPlotData.PostProp}
        min={diagnosisPlotData.PostPropLB}
        range={diagnosisPlotData.PostPropRange}
      />
  }

  return (
    <React.Fragment>
      <Title sx={{marginTop: '30px'}}>Figure 3. Proportion of migrants infected post arrival by region of origin and year of arrival</Title>
      {arrivalPlot}

      <Title sx={{marginTop: '30px'}}>Figure 4. Proportion of migrants infected post arrival by region of origin and year of diagnosis</Title>
      {diagnosisPlot}
    </React.Fragment>
  )
};

export default observer(PropCharts);

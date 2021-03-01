import React from 'react';
import { observer } from 'mobx-react';
import HIVChart from '../Charts/HIVChart';
import IsNull from '../../utilities/IsNull';

const TabModellingCharts = props => {

  const { appMgr } = props;

  if (IsNull(appMgr.modelMgr.plotData)) {
    return (null);
  }

  return (
    <React.Fragment>
      <HIVChart
        title='A. HIV infections per year'
        year={appMgr.modelMgr.plotData.Year}
        model={appMgr.modelMgr.plotData.N_Inf_M}
        min={appMgr.modelMgr.plotData.N_Inf_M_LB}
        range={appMgr.modelMgr.plotData.N_Inf_M_Range}
      />
      <HIVChart
        title='B. Time to diagnosis'
        year={appMgr.modelMgr.plotData.Year}
        model={appMgr.modelMgr.plotData.t_diag}
        min={appMgr.modelMgr.plotData.t_diag_LB}
        range={appMgr.modelMgr.plotData.t_diag_Range}
      />
      <HIVChart
        title='C. Total number of HIV-infected'
        year={appMgr.modelMgr.plotData.Year}
        model={appMgr.modelMgr.plotData.N_Alive}
        min={appMgr.modelMgr.plotData.N_Alive_LB}
        range={appMgr.modelMgr.plotData.N_Alive_Range}
      />
      <HIVChart
        title='D. Proportion undiagnosed of all those alive'
        year={appMgr.modelMgr.plotData.Year}
        model={appMgr.modelMgr.plotData.N_Und_Alive_p}
        min={appMgr.modelMgr.plotData.N_Und_Alive_p_LB}
        range={appMgr.modelMgr.plotData.N_Und_Alive_p_Range}
      />
    </React.Fragment>
  );
};

export default observer(TabModellingCharts);

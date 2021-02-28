import React from 'react';
import { observer } from 'mobx-react';
import HIVChart from '../Charts/HIVChart';

const TabModellingTablesGOF = props => {

  const { appMgr } = props;

  return (
    <React.Fragment>
      <HIVChart
        title='A. HIV diagnoses, total'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_HIV_D}
        model={appMgr.modelMgr.plotData.N_HIV_Obs_M}
        min={appMgr.modelMgr.plotData.N_HIV_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_HIV_Obs_M_Range}
      />
      <HIVChart
        title='B. HIV diagnoses, CD4 >= 500'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_CD4_1_D}
        model={appMgr.modelMgr.plotData.N_CD4_1_Obs_M}
        min={appMgr.modelMgr.plotData.N_CD4_1_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_CD4_1_Obs_M_Range}
      />
      <HIVChart
        title='C. HIV diagnoses, CD4 350 - 499'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_CD4_2_D}
        model={appMgr.modelMgr.plotData.N_CD4_2_Obs_M}
        min={appMgr.modelMgr.plotData.N_CD4_2_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_CD4_2_Obs_M_Range}
      />
      <HIVChart
        title='D. HIV diagnoses, CD4 200 - 349'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_CD4_3_D}
        model={appMgr.modelMgr.plotData.N_CD4_3_Obs_M}
        min={appMgr.modelMgr.plotData.N_CD4_3_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_CD4_3_Obs_M_Range}
      />
      <HIVChart
        title='E. HIV diagnoses, CD4 < 200'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_CD4_4_D}
        model={appMgr.modelMgr.plotData.N_CD4_4_Obs_M}
        min={appMgr.modelMgr.plotData.N_CD4_4_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_CD4_4_Obs_M_Range}
      />
      <HIVChart
        title='F. HIV/AIDS diagnoses'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_HIVAIDS_D}
        model={appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M}
        min={appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_LB}
        range={appMgr.modelMgr.plotData.N_HIVAIDS_Obs_M_Range}
      />
      <HIVChart
        title='G. AIDS diagnoses, total'
        year={appMgr.modelMgr.plotData.Year}
        data={appMgr.modelMgr.plotData.N_AIDS_D}
        model={appMgr.modelMgr.plotData.N_AIDS_M}
        min={appMgr.modelMgr.plotData.N_AIDS_M_LB}
        range={appMgr.modelMgr.plotData.N_AIDS_M_Range}
      />
    </React.Fragment>
  );
};

export default observer(TabModellingTablesGOF);

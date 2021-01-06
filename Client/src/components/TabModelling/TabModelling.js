import React from 'react';
import { observer } from 'mobx-react';
import TabModellingPopulation from './TabModellingPopulation';
import TabModellingInputs from './TabModellingInputs';
import TabModellingAdvanced from './TabModellingAdvanced';
import TabModellingRunMain from './TabModellingRunMain';
import TabModellingRunBootstrap from './TabModellingRunBootstrap';
import TabModellingTables from './TabModellingTables';

const TabModelling = (props) => {
  const { appMgr } = props;

  const activeSubStepId = appMgr.uiStateMgr.steps[appMgr.uiStateMgr.activeStepId].activeSubStepId;

  return (
    <React.Fragment>
      {activeSubStepId === 0 && <TabModellingPopulation {...props} />}
      {activeSubStepId === 1 && <TabModellingInputs {...props} />}
      {activeSubStepId === 2 && <TabModellingAdvanced {...props} />}
      {activeSubStepId === 3 && <TabModellingRunMain {...props} />}
      {activeSubStepId === 4 && <TabModellingRunBootstrap {...props} />}
      {activeSubStepId === 5 && <TabModellingTables {...props} />}
    </React.Fragment>
  );
};

export default observer(TabModelling);

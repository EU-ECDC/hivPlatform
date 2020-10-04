import React from 'react';
import { observer } from 'mobx-react';
import TabModellingPopulation from './TabModellingPopulation';
import TabModellingInputs from './TabModellingInputs';
import TabModellingAdvanced from './TabModellingAdvanced';
import TabModellingRun from './TabModellingRun';
import TabModellingTables from './TabModellingTables';

const TabModelling = (props) => {
  const { appManager } = props;

  const activeSubStepId = appManager.steps[appManager.activeStepId].activeSubStepId;

  return (
    <React.Fragment>
      {activeSubStepId === 0 && <TabModellingPopulation {...props} />}
      {activeSubStepId === 1 && <TabModellingInputs {...props} />}
      {activeSubStepId === 2 && <TabModellingAdvanced {...props} />}
      {activeSubStepId === 3 && <TabModellingRun {...props} />}
      {activeSubStepId === 4 && <TabModellingTables {...props} />}
    </React.Fragment>
  );
};

export default observer(TabModelling);

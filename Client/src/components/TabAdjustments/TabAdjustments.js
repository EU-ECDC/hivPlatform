import React from 'react';
import { observer } from 'mobx-react';
import TabAdjustmentsInputs from './TabAdjustmentsInputs';
import TabAdjustmentsRun from './TabAdjustmentsRun';

const TabAdjustments = (props) => {
  const { appMgr } = props;

  const activeSubStepId = appMgr.uiStateMgr.steps[appMgr.uiStateMgr.activeStepId].activeSubStepId;

  return (
    <React.Fragment>
      {activeSubStepId === 0 && <TabAdjustmentsInputs {...props} />}
      {activeSubStepId === 1 && <TabAdjustmentsRun {...props} />}
    </React.Fragment>
  );
};

export default observer(TabAdjustments);

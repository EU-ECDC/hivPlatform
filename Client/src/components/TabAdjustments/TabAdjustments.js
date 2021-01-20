import React from 'react';
import { observer } from 'mobx-react';
import TabAdjustmentsInputs from './TabAdjustmentsInputs';
import TabAdjustmentsRun from './TabAdjustmentsRun';

const TabAdjustments = (props) => {
  const { appMgr } = props;

  const activeSubPageId = appMgr.uiStateMgr.activeSubPageId;

  return (
    <React.Fragment>
      {activeSubPageId === 0 && <TabAdjustmentsInputs {...props} />}
      {activeSubPageId === 1 && <TabAdjustmentsRun {...props} />}
    </React.Fragment>
  );
};

export default observer(TabAdjustments);

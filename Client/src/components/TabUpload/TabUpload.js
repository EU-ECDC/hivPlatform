import React from 'react';
import { observer } from 'mobx-react';
import TabUploadCase from './TabUploadCase';
import TabUploadAggregated from './TabUploadAggregated';

const TabUpload = (props) => {
  const { appMgr } = props;

  const activeSubStepId = appMgr.uiStateMgr.steps[appMgr.uiStateMgr.activeStepId].activeSubStepId;

  return (
    <React.Fragment>
      {activeSubStepId === 0 && <TabUploadCase {...props} />}
      {activeSubStepId === 1 && <TabUploadAggregated {...props} />}
    </React.Fragment>
  );
};

export default observer(TabUpload);

import React from 'react';
import { observer } from 'mobx-react';
import TabUploadCase from './TabUploadCase';
import TabUploadAggregated from './TabUploadAggregated';

const TabUpload = (props) => {
  const { appManager } = props;

  const activeSubStepId = appManager.steps[appManager.activeStepId].activeSubStepId;

  return (
    <React.Fragment>
      {activeSubStepId === 0 && <TabUploadCase {...props} />}
      {activeSubStepId === 1 && <TabUploadAggregated {...props} />}
    </React.Fragment>
  );
};

export default observer(TabUpload);

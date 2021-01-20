import React from 'react';
import { observer } from 'mobx-react';
import TabUploadCase from './TabUploadCase';
import TabUploadAggregated from './TabUploadAggregated';

const TabUpload = (props) => {
  const { appMgr } = props;

  const activeSubPageId = appMgr.uiStateMgr.activeSubPageId;

  return (
    <React.Fragment>
      {activeSubPageId === 0 && <TabUploadCase {...props} />}
      {activeSubPageId === 1 && <TabUploadAggregated {...props} />}
    </React.Fragment>
  );
};

export default observer(TabUpload);

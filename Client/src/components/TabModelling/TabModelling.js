import React from 'react';
import { observer } from 'mobx-react';
import TabModellingMigrant from './TabModellingMigrant';
import TabModellingPopulation from './TabModellingPopulation';
import TabModellingInputs from './TabModellingInputs';
import TabModellingAdvanced from './TabModellingAdvanced';
import TabModellingRunMain from './TabModellingRunMain';
import TabModellingRunBootstrap from './TabModellingRunBootstrap';
import TabModellingOutputs from './TabModellingOutputs';

const TabModelling = (props) => {
  const { appMgr } = props;

  const activeSubPageId = appMgr.uiStateMgr.activeSubPageId;

  return (
    <React.Fragment>
      {activeSubPageId === 0 && <TabModellingPopulation {...props} />}
      {activeSubPageId === 1 && <TabModellingInputs {...props} />}
      {activeSubPageId === 2 && <TabModellingAdvanced {...props} />}
      {activeSubPageId === 3 && <TabModellingRunMain {...props} />}
      {activeSubPageId === 4 && <TabModellingRunBootstrap {...props} />}
      {activeSubPageId === 5 && <TabModellingOutputs {...props} />}
    </React.Fragment>
  );
};

export default observer(TabModelling);

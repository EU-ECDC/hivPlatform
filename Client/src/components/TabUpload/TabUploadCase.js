import React from 'react';
import { observer } from 'mobx-react';
import Divider from '@material-ui/core/Divider';
import TabPanel from '../TabPanel';
import CaseUpload from './CaseUpload';
import OriginGroupings from './OriginGroupings';
import AttributeMapping from './AttributeMapping';

const TabUploadCase = (props) => {
  const { appManager } = props;

  React.useEffect(
    () => {
      appManager.unbindShinyInputs();
      appManager.bindShinyInputs();

      return () => appManager.unbindShinyInputs();
    }
  );

  const divider = <Divider light style={{ margin: '30px 0' }} />;

  return (
    <TabPanel>
      <CaseUpload appManager={appManager} />
      { appManager.uiStateMgr.caseBasedAttrMappingStageEnabled &&
        <React.Fragment>
          {divider}
          <AttributeMapping appManager={appManager} />
        </React.Fragment>
      }
      { appManager.uiStateMgr.caseBasedOrigGrpngStageEnabled &&
        <React.Fragment>
          {divider}
          <OriginGroupings appManager={appManager} />
        </React.Fragment>
      }
    </TabPanel>
  );
};

export default observer(TabUploadCase);

import React from 'react';
import { observer } from 'mobx-react';
import Divider from '@material-ui/core/Divider';
import TabPanel from '../TabPanel';
import CaseUpload from './CaseUpload';
import OriginGroupings from './OriginGroupings';
import AttributeMapping from './AttributeMapping';

const TabUploadCase = (props) => {
  const { appMgr } = props;

  const divider = <Divider light style={{ margin: '30px 0' }} />;

  return (
    <TabPanel>
      <CaseUpload {...props} />
      { appMgr.uiStateMgr.caseBasedAttrMappingEnabled &&
        <React.Fragment>
          {divider}
          <AttributeMapping {...props} />
        </React.Fragment>
      }
      { appMgr.uiStateMgr.caseBasedOrigGroupingEnabled &&
        <React.Fragment>
          {divider}
          <OriginGroupings {...props} />
        </React.Fragment>
      }
    </TabPanel>
  );
};

export default observer(TabUploadCase);

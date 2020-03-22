import React from 'react';
import { observer } from 'mobx-react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import TabPanel from './TabPanel';
import Btn from './Btn';

const TabUploadCase = (props) => {
  const { appManager } = props;

  React.useEffect(
    () => {
      appManager.unbindShinyInputs();
      appManager.bindShinyInputs();

      return () => appManager.unbindShinyInputs();
    }
  );

  return (
    <TabPanel>
      <input style={{ display: 'none' }} id='caseUploadBtn' className='uploadBtn' type='file' />
      <Tooltip title='Select case-based data file'>
        <label htmlFor='caseUploadBtn'>
          <Btn>Upload</Btn>
        </label>
      </Tooltip>
      {appManager.fileUploadProgress && <LinearProgress variant='determinate' value={appManager.fileUploadProgress * 100} color='secondary' />}
    </TabPanel>
  );
};

export default observer(TabUploadCase);

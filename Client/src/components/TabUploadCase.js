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
      <div>
        <ul>
          <li>File name: {appManager.caseBasedDataFileName}</li>
          <li>File size: {appManager.caseBasedDataFileSize}</li>
          <li>File type: {appManager.caseBasedDataFileType}</li>
          <li>Data path: {appManager.caseBasedDataPath}</li>
        </ul>
      </div>
    </TabPanel>
  );
};

export default observer(TabUploadCase);

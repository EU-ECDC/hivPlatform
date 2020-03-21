import React from 'react';
import Input from '@material-ui/core/Input';
import TabPanel from './TabPanel';
import { red } from '@material-ui/core/colors';

const TabUploadCase = (props) => {
  const { appManager, activeTabId } = props;

  React.useEffect(
    () => {
      appManager.unbindShinyInputs();
      appManager.bindShinyInputs();

      return () => appManager.unbindShinyInputs();
    }
  );

  return (
    <TabPanel>
      <Input type='file' id='test' name='test' />
      <div id='test_progress' className='shiny-file-input-progress' style={{width: 303, height: 32, backgroundColor: '#e1dbdb', padding: 2}}>
        <div className='progress-bar' style={{ width: '100%', height: '100%', backgroundColor: '#69b023', color: 'white', padding: 2 }}></div>
      </div>
    </TabPanel>
  );
};

export default TabUploadCase;

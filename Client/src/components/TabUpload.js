import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';
import TabUploadCase from './TabUploadCase';

const TabUpload = (props) => {
  const [activeTabId, setActiveTabId] = React.useState(0);
  const handleChange = (event, tabId) => setActiveTabId(tabId);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tabs
          value={activeTabId}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
        >
          <Tab label='Case-based data'/>
          <Tab label='Aggregated data'/>
        </Tabs>
        {activeTabId === 0 && <TabUploadCase {...props} />}
        {activeTabId === 1 &&
          <TabPanel>
            Item Two
          </TabPanel>
        }
      </Grid>
    </Grid>
  );
};

export default TabUpload;

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabUploadCase from './TabUploadCase';
import TabUploadAggregated from './TabUploadAggregated';

const TabUpload = (props) => {
  const [activeTabId, setActiveTabId] = React.useState(1);
  const handleChange = (event, tabId) => setActiveTabId(tabId);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Button size='small' color='primary'>Next step</Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Tabs
          value={activeTabId}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
        >
          <Tab label='Case-based data'/>
          <Tab label='Aggregated data' />
        </Tabs>
        {activeTabId === 0 && <TabUploadCase {...props} />}
        {activeTabId === 1 && <TabUploadAggregated {...props} />}
      </Grid>
    </Grid>
  );
};

export default TabUpload;

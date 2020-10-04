import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TabPanel from '../TabPanel';

const TabModellingTables = props => {
  const { appManager } = props;

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingTables;

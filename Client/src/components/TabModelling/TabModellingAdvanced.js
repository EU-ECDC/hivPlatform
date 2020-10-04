import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TabPanel from '../TabPanel';
import AdvancedParameters from '../AdvancedParameters';

const TabModellingAdvanced = props => {
  const { appManager } = props;

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Advanced paramaters
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <AdvancedParameters />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingAdvanced;

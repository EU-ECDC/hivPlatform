import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TabPanel from '../TabPanel';
import AdvancedParameters from './AdvancedParameters';

const TabModellingAdvanced = props => {

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary' disabled={true}>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Advanced paramaters
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={10}>
          <AdvancedParameters {...props}/>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingAdvanced;

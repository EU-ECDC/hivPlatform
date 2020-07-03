import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TabPanel from './TabPanel';
import CreatePopulations from './CreatePopulations';
import PopulationCombinations from './PopulationCombinations';

const TabModellingPopulation = props => {
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
            Create populations
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <CreatePopulations />
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Combine populations
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <PopulationCombinations />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingPopulation;

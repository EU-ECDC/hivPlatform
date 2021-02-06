import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TabPanel from '../TabPanel';
import CreatePopulations from './CreatePopulations';
import CombinePopulations from './CombinePopulations';
import AggregatedDataPopulations from './AggregatedDataPopulations';

const TabModellingPopulation = props => {

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Case-based data
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>
            Create populations from data
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Stratify data by values present in the data.
            Select one or more variables.
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <CreatePopulations {...props} />
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={2}>
          <Typography color='textSecondary'>
            Aggregated data: Select data
          </Typography>
          <Typography variant='body2' color='textSecondary' style={{ marginTop: 10 }}>
            Only years present in the aggregated data set will overwrite case-based derived data.
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <AggregatedDataPopulations {...props} />
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={2}>
          <Typography color='textSecondary'>
            Combine populations
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <CombinePopulations {...props} />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingPopulation;

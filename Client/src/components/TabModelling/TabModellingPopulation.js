import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TabPanel from '../TabPanel';
import CreatePopulations from './CreatePopulations';
import CombinePopulations from './CombinePopulations';
import AggregatedDataPopulations from './AggregatedDataPopulations';

const TabModellingPopulation = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 1);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
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
        <Grid item xs={12}>
          <Typography variant='h6'>
            Aggregated data
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>
            Select data for modelling
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Only years present in the aggregated data set will overwrite case-based derived data.
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <AggregatedDataPopulations {...props} />
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Combine populations
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='body2' color='textSecondary'>
            Combine case-based and aggregated data populations.
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

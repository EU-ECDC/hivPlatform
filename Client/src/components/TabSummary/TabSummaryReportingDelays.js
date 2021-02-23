import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import RepDelChart from '../Charts/RepDelChart';

const TabSummaryReportingDelays = (props) => {
  const { appMgr } = props;

  const handleDataSelection = (e) => appMgr.summaryDataMgr.setRepDelPlotSelection(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='h6'>
          Reporting delays summary
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='body2' color='textSecondary'>
          Average reporting delay for cases notified within a quarter and the upper bound for
          typical average delay values. Quarters when the average delay exceeds the upper bound
          may indicate cleaning events in surveillance.
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='repDelDataSelection'
            value={appMgr.summaryDataMgr.repDelPlotSelection}
            onChange={handleDataSelection}
          >
            <FormControlLabel
              value='all'
              control={<Radio color='primary' size='small' />}
              label='All'
            />
            <FormControlLabel
              value='female'
              control={<Radio color='primary' size='small' />}
              label='Female'
            />
            <FormControlLabel
              value='male'
              control={<Radio color='primary' size='small' />}
              label='Male'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={10}>
        <Paper style={{ padding: 10 }}>
          <RepDelChart
            yLabelName='Proportion of reported with delay'
            data={appMgr.summaryDataMgr.repDelPlot.series}
            q95={appMgr.summaryDataMgr.repDelPlot.q95}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryReportingDelays);

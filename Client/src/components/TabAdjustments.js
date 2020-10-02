import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import LinearProgress from '@material-ui/core/LinearProgress';
import TabPanel from './TabPanel';
import Btn from './Btn';
import Skel from './Skeleton';
import TabAdjustmentsMI from './TabAdjustmentsMI';

const AdjustmentsRunProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress color='secondary' />
};

const TabAdjustments = (props) => {
  const { appManager } = props;

  const onRunAdjustBtnClick = () => {
    appManager.btnClicked('runAdjustBtn');
  }

  const onCancelAdjustBtnClick = () => {
    appManager.btnClicked('cancelAdjustBtn');
  }

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <TabAdjustmentsMI appManager={appManager} />
        <Grid item xs={3}>
          <Typography variant='body1'>
            Reporting Delays adjustment
          </Typography>
          <FormControl component='fieldset'>
            <RadioGroup name='rdAdjustType' defaultValue='withTrend'>
              <FormControlLabel
                value='none'
                control={<Radio color='primary' size='small' />}
                label='None'
              />
              <FormControlLabel
                value='withTrend'
                control={<Radio color='primary' size='small' />}
                label='Without trend'
              />
              <FormControlLabel
                value='withoutTrend'
                control={<Radio color='primary' size='small' />}
                label='With trend'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Reporting Delays with trend parameters</Typography>
            <Skel />
            <Button color='primary'>Restore defaults</Button>
            <Button color='primary'>Apply</Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Btn
            onClick={onRunAdjustBtnClick}
            disabled={appManager.adjustmentsRunInProgress}
          >
            <DirectionsRunIcon />&nbsp;Run adjustments
          </Btn>
          <Button
            onClick={onCancelAdjustBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appManager.adjustmentsRunInProgress}
          >
            Cancel
          </Button>
          <AdjustmentsRunProgressBar progress={appManager.adjustmentsRunProgress} />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre>
              {appManager.adjustmentsRunLog}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabAdjustments);

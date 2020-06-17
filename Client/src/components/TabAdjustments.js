import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import LinearProgress from '@material-ui/core/LinearProgress';
import TabPanel from './TabPanel';
import Btn from './Btn';
import Skel from './Skeleton';

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

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body1'>
            Multiple Imputations adjustment
          </Typography>
          <FormControl component='fieldset'>
            <RadioGroup name='miAdjustType' defaultValue='jomo'>
              <FormControlLabel
                value='none'
                control={<Radio color='primary' size='small' />}
                label='None'
              />
              <FormControlLabel
                value='jomo'
                control={<Radio color='primary' size='small' />}
                label='Joint Modelling - JOMO'
              />
              <FormControlLabel
                value='mice'
                control={<Radio color='primary' size='small' />}
                label='Chained Equations - MICE'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Joint Modelling - JOMO parameters</Typography>
            <form noValidate autoComplete='off' style={{width: 400}}>
              <TextField label='Number of imputations' helperText='Type the number of data sets to input' type='number' defaultValue={2} fullWidth variant='filled' style={{marginBottom: 20}}/>
              <TextField label='Number of burn-in iterations' helperText='Type the number of inital iterations to skip before imputing' type='number' defaultValue={100} fullWidth variant='filled' style={{ marginBottom: 20 }}/>
              <TextField label='Number of iterations between two successive imputations' type='number' defaultValue={100} fullWidth variant='filled' style={{ marginBottom: 20 }} />
              <Typography id="discrete-slider" gutterBottom>
                Number of degrees of freedom for spline of diagnosis calendar year
              </Typography>
              <Slider
                min={3}
                max={5}
                defaultValue={4}
                marks={[{ value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }]}
              />
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={true} onChange={() => { }} name='check' color='primary'/>}
                  label='Impute reporting delays inputs'
                />
              </FormGroup>
              <Button color='primary'>Restore defaults</Button>
              <Button color='primary'>Apply</Button>
            </form>
          </Paper>
        </Grid>
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
          <Btn onClick={onRunAdjustBtnClick}><DirectionsRunIcon />&nbsp;Run adjustments</Btn>
          <Button color='primary' style={{ marginLeft: 20 }}>Cancel</Button>
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

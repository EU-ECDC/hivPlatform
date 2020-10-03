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
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Skel from './Skeleton';

const TabAdjustmentsMI = (props) => {
  const { appManager } = props;

  const handleDataSelection = (e) => appManager.adjustMgr.setMIAdjustType(e.target.value);
  const handleMIJomoNimpChange = (e) => appManager.adjustMgr.setMIJomoNimp(e.target.value);
  const handleMIJomoNburnChange = (e) => appManager.adjustMgr.setMIJomoNburn(e.target.value);
  const handleMIJomoNbetweenChange = (e) => appManager.adjustMgr.setMIJomoNbetween(e.target.value);
  const handleMIJomoNsdfChange = (e, value) => appManager.adjustMgr.setMIJomoNsdf(value);
  const handleMIJomoImputeRDChange = (e, value) => appManager.adjustMgr.setMIJomoImputeRD(value);
  const handleMIMiceNimpChange = (e) => appManager.adjustMgr.setMIMiceNimp(e.target.value);
  const handleMIMiceNitChange = (e) => appManager.adjustMgr.setMIMiceNit(e.target.value);
  const handleMIMiceNsdfChange = (e, value) => appManager.adjustMgr.setMIMiceNsdf(value);
  const handleMIMiceImputeRDChange = (e, value) => appManager.adjustMgr.setMIMiceImputeRD(value);
  const handleMIRestoreDefaults = (type) => (e) => appManager.adjustMgr.restoreDefaults(type);

  let miEditWidget = null;
  if (appManager.adjustMgr.miAdjustType === 'none') {
    miEditWidget =
      <Paper style={{ padding: 10 }}>
      <Typography variant='overline'>No parameters</Typography>
      <Typography>
        Select adjustment to set its parameters
      </Typography>
      </Paper>
  } else if (appManager.adjustMgr.miAdjustType === 'jomo') {
    miEditWidget =
      <Paper style={{ padding: 10 }}>
        <Typography variant='overline'>Joint Modelling - JOMO parameters</Typography>
        <form noValidate autoComplete='off' style={{ width: 400 }}>
          <TextField
            label='Number of imputations'
            helperText='Type the number of data sets to input'
            type='number'
            value={appManager.adjustMgr.miJomoSettings.nimp}
            onChange={handleMIJomoNimpChange}
            fullWidth
            variant='filled'
            style={{ marginBottom: 20 }}
          />
          <TextField
            label='Number of burn-in iterations'
            helperText='Type the number of inital iterations to skip before imputing'
            type='number'
            value={appManager.adjustMgr.miJomoSettings.nburn}
            onChange={handleMIJomoNburnChange}
            fullWidth
            variant='filled'
            style={{ marginBottom: 20 }}
          />
          <TextField
            label='Number of iterations between two successive imputations'
            type='number'
            value={appManager.adjustMgr.miJomoSettings.nbetween}
            onChange={handleMIJomoNbetweenChange}
            fullWidth
            variant='filled'
            style={{ marginBottom: 20 }}
          />
          <Typography id="discrete-slider" gutterBottom>
            Number of degrees of freedom for spline of diagnosis calendar year
        </Typography>
          <Slider
            min={3}
            max={5}
            value={appManager.adjustMgr.miJomoSettings.nsdf}
            onChange={handleMIJomoNsdfChange}
            marks={[{ value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }]}
          />
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={appManager.adjustMgr.miJomoSettings.imputeRD} onChange={handleMIJomoImputeRDChange} name='check' color='primary' />}
              label='Impute reporting delays inputs'
            />
          </FormGroup>
          <Button color='primary' onClick={handleMIRestoreDefaults('jomo')}>Restore defaults</Button>
        </form>
      </Paper >
  } else if(appManager.adjustMgr.miAdjustType === 'mice') {
    miEditWidget = <Paper style={{ padding: 10 }}>
      <Typography variant='overline'>Chained Equations - MICE parameters</Typography>
      <form noValidate autoComplete='off' style={{ width: 400 }}>
        <TextField
          label='Number of imputations'
          helperText='Type the number of data sets to input'
          type='number'
          value={appManager.adjustMgr.miMiceSettings.nimp}
          onChange={handleMIMiceNimpChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <TextField
          label='Number of mice iterations'
          helperText='Type the number of mice iterations'
          type='number'
          value={appManager.adjustMgr.miMiceSettings.nit}
          onChange={handleMIMiceNitChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <Typography id="discrete-slider" gutterBottom>
          Number of degrees of freedom for spline of diagnosis calendar year
        </Typography>
        <Slider
          min={3}
          max={5}
          value={appManager.adjustMgr.miMiceSettings.nsdf}
          onChange={handleMIMiceNsdfChange}
          marks={[{ value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }]}
        />
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.miMiceSettings.imputeRD} onChange={handleMIMiceImputeRDChange} name='check' color='primary' />}
            label='Impute reporting delays inputs'
          />
        </FormGroup>
        <Button color='primary' onClick={handleMIRestoreDefaults('mice')}>Restore defaults</Button>
      </form>
    </Paper >
  }

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography variant='body1'>
          Multiple Imputations adjustment
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='miAdjustType'
            value={appManager.adjustMgr.miAdjustType}
            onChange={handleDataSelection}
          >
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
        {miEditWidget}
      </Grid>
    </React.Fragment>
  );
};

export default observer(TabAdjustmentsMI);

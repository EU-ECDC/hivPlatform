import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsMIJomo = (props) => {
  const { appManager } = props;

  const handleMIJomoNimpChange = (e) => appManager.adjustMgr.setMIJomoNimp(e.target.value);
  const handleMIJomoNburnChange = (e) => appManager.adjustMgr.setMIJomoNburn(e.target.value);
  const handleMIJomoNbetweenChange = (e) => appManager.adjustMgr.setMIJomoNbetween(e.target.value);
  const handleMIJomoNsdfChange = (e, value) => appManager.adjustMgr.setMIJomoNsdf(value);
  const handleMIJomoImputeRDChange = (e, value) => appManager.adjustMgr.setMIJomoImputeRD(value);
  const handleMIRestoreDefaults = (e) => appManager.adjustMgr.restoreMIDefaults('jomo');

  return (
      <React.Fragment>
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
          <Button color='primary' onClick={handleMIRestoreDefaults}>Restore defaults</Button>
        </form>
      </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsMIJomo);

import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsMIJomo = (props) => {
  const { appMgr } = props;

  const handleMIJomoNimpChange = (e) => appMgr.adjustMgr.setMIJomoNimp(e.target.value);
  const handleMIJomoNburnChange = (e) => appMgr.adjustMgr.setMIJomoNburn(e.target.value);
  const handleMIJomoNbetweenChange = (e) => appMgr.adjustMgr.setMIJomoNbetween(e.target.value);
  const handleMIJomoNsdfChange = (e, value) => appMgr.adjustMgr.setMIJomoNsdf(value);
  const handleMIJomoImputeRDChange = (e, value) => appMgr.adjustMgr.setMIJomoImputeRD(value);
  const handleMIRestoreDefaults = (e) => appMgr.adjustMgr.restoreMIDefaults('jomo');

  return (
      <React.Fragment>
        <Typography variant='overline'>Joint Modelling - JOMO parameters</Typography>
      <form noValidate autoComplete='off'>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label='Number of imputations'
              helperText='Type the number of data sets to input'
              type='number'
              value={appMgr.adjustMgr.miJomoSettings.nimp}
              onChange={handleMIJomoNimpChange}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1, max: 1000
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Number of burn-in iterations'
              helperText='Type the number of inital iterations to skip before imputing'
              type='number'
              value={appMgr.adjustMgr.miJomoSettings.nburn}
              onChange={handleMIJomoNburnChange}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1, max: 1000
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Number of iterations between two successive imputations'
              type='number'
              value={appMgr.adjustMgr.miJomoSettings.nbetween}
              onChange={handleMIJomoNbetweenChange}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1, max: 1000
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography id="discrete-slider" gutterBottom>
              Number of degrees of freedom for spline of diagnosis calendar year
          </Typography>
            <Slider
              min={3}
              max={5}
              value={appMgr.adjustMgr.miJomoSettings.nsdf}
              onChange={handleMIJomoNsdfChange}
              marks={[{ value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }]}
            />
          </Grid>
          <Grid item xs={4}>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={appMgr.adjustMgr.miJomoSettings.imputeRD} onChange={handleMIJomoImputeRDChange} name='check' color='primary' />}
                label='Impute reporting delays inputs'
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button color='primary' onClick={handleMIRestoreDefaults}>Restore defaults</Button>
          </Grid>
        </Grid>
        </form>
      </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsMIJomo);

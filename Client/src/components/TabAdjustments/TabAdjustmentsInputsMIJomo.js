import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

const TabAdjustmentsInputsMIJomo = (props) => {
  const { appMgr } = props;

  const handleMIJomoNimpChange = (e) => appMgr.adjustMgr.setMIJomoNimp(e.target.value);
  const handleMIJomoNimpBlur = (e) =>
    appMgr.adjustMgr.setMIJomoNimp(Math.min(Math.max(e.target.value, 2), 50));

  const handleMIJomoNburnChange = (e) => appMgr.adjustMgr.setMIJomoNburn(e.target.value);
  const handleMIJomoNburnBlur = (e) =>
    appMgr.adjustMgr.setMIJomoNburn(Math.min(Math.max(e.target.value, 100), 10000));

  const handleMIJomoNbetweenChange = (e) => appMgr.adjustMgr.setMIJomoNbetween(e.target.value);
  const handleMIJomoNbetweenBlur = (e) =>
    appMgr.adjustMgr.setMIJomoNbetween(Math.min(Math.max(e.target.value, 100), 10000));

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
              onBlur={handleMIJomoNimpBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 2, max: 50
                }
              }}
              sx={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Number of burn-in iterations'
              helperText='Type the number of inital iterations to skip before imputing'
              type='number'
              value={appMgr.adjustMgr.miJomoSettings.nburn}
              onChange={handleMIJomoNburnChange}
              onBlur={handleMIJomoNburnBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 100, max: 10000
                }
              }}
              sx={{ marginBottom: '20px' }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Number of iterations between two successive imputations'
              type='number'
              value={appMgr.adjustMgr.miJomoSettings.nbetween}
              onChange={handleMIJomoNbetweenChange}
              onBlur={handleMIJomoNbetweenBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 100, max: 10000
                }
              }}
              sx={{ marginBottom: '20px' }}
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

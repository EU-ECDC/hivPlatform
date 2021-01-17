import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsRDWithout = (props) => {
  const { appMgr } = props;

  const handleRDWithoutStartYearChange = (e) => appMgr.adjustMgr.setRDWithoutStartYear(e.target.value);
  const handleRDWithoutEndYearChange = (e) => appMgr.adjustMgr.setRDWithoutEndYear(e.target.value);
  const handleRDWithoutEndQrtChange = (e) => appMgr.adjustMgr.setRDWithoutEndQrt(e.target.value);
  const handleRDWithoutStratGenderChange = (e, value) => appMgr.adjustMgr.setRDWithoutStratGender(value);
  const handleRDWithoutStratTransChange = (e, value) => appMgr.adjustMgr.setRDWithoutStratTrans(value);
  const handleRDWithoutStratMigrChange = (e, value) => appMgr.adjustMgr.setRDWithoutStratMigr(value);
  const handleRDRestoreDefaults = (e) => appMgr.adjustMgr.restoreRDDefaults('withoutTrend');

  return (
    <React.Fragment>
      <Typography variant='overline'>Reporting Delays - without trend parameters</Typography>
      <form noValidate autoComplete='off'>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label='Diagnosis start year'
              helperText='Enter the start year for diagnosis'
              type='number'
              value={appMgr.adjustMgr.rdWithoutTrendSettings.startYear}
              onChange={handleRDWithoutStartYearChange}
              fullWidth
              variant='filled'
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Notification end year'
              helperText='Enter the end year for notification'
              type='number'
              value={appMgr.adjustMgr.rdWithoutTrendSettings.endYear}
              onChange={handleRDWithoutEndYearChange}
              fullWidth
              variant='filled'
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Notification end quarter (integer between 1 and 4)'
              type='number'
              value={appMgr.adjustMgr.rdWithoutTrendSettings.endQrt}
              onChange={handleRDWithoutEndQrtChange}
              fullWidth
              variant='filled'
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            Stratify by:
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratGender} onChange={handleRDWithoutStratGenderChange} name='check' color='primary' />}
                label='Gender'
              />
              <FormControlLabel
                control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratTrans} onChange={handleRDWithoutStratTransChange} name='check' color='primary' />}
                label='Transmission'
              />
              <FormControlLabel
                control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratMigr} onChange={handleRDWithoutStratMigrChange} name='check' color='primary' />}
                label='Migration'
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button color='primary' onClick={handleRDRestoreDefaults}>Restore defaults</Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsRDWithout);

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsRDWith = (props) => {
  const { appMgr } = props;

  const handleRDWithStartYearChange = (e) => appMgr.adjustMgr.setRDWithStartYear(e.target.value);
  const handleRDWithStartYearBlur = (e) =>
    appMgr.adjustMgr.setRDWithStartYear(Math.min(Math.max(e.target.value, 1975), 2030));

  const handleRDWithEndYearChange = (e) => appMgr.adjustMgr.setRDWithEndYear(e.target.value);
  const handleRDWithEndYearBlur = (e) =>
    appMgr.adjustMgr.setRDWithEndYear(Math.min(Math.max(e.target.value, 1975), 2030));

  const handleRDWithEndQrtChange = (e) => appMgr.adjustMgr.setRDWithEndQrt(e.target.value);
  const handleRDWithEndQrtBlur = (e) =>
    appMgr.adjustMgr.setRDWithEndQrt(Math.min(Math.max(e.target.value, 1), 4));

  const handleRDWithStratGenderChange = (e, value) => appMgr.adjustMgr.setRDWithStratGender(value);
  const handleRDWithStratTransChange = (e, value) => appMgr.adjustMgr.setRDWithStratTrans(value);
  const handleRDWithStratMigrChange = (e, value) => appMgr.adjustMgr.setRDWithStratMigr(value);
  const handleRDRestoreDefaults = (e) => appMgr.adjustMgr.restoreRDDefaults('withTrend');

  return (
    <React.Fragment>
      <Typography variant='overline'>Reporting Delays - with trend parameters</Typography>
      <form noValidate autoComplete='off'>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label='Diagnosis start year'
              helperText='Enter the start year for diagnosis'
              type='number'
              value={appMgr.adjustMgr.rdWithTrendSettings.startYear}
              onChange={handleRDWithStartYearChange}
              onBlur={handleRDWithStartYearBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1975, max: 2030
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Notification end year'
              helperText='Enter the end year for notification'
              type='number'
              value={appMgr.adjustMgr.rdWithTrendSettings.endYear}
              onChange={handleRDWithEndYearChange}
              onBlur={handleRDWithEndYearBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1975, max: 2030
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label='Notification end quarter (integer between 1 and 4)'
              type='number'
              value={appMgr.adjustMgr.rdWithTrendSettings.endQrt}
              onChange={handleRDWithEndQrtChange}
              onBlur={handleRDWithEndQrtBlur}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1, max: 4
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </Grid>
          <Grid item xs={4}>
            Stratify by:
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.adjustMgr.rdWithTrendSettings.stratGender}
                    onChange={handleRDWithStratGenderChange}
                    name='check'
                    color='primary'
                  />
                }
                label='Gender'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.adjustMgr.rdWithTrendSettings.stratTrans}
                    onChange={handleRDWithStratTransChange}
                    name='check'
                    color='primary'
                  />
                }
                label='Transmission'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.adjustMgr.rdWithTrendSettings.stratMigr}
                    onChange={handleRDWithStratMigrChange}
                    name='check'
                    color='primary'
                  />
                }
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

export default observer(TabAdjustmentsInputsRDWith);

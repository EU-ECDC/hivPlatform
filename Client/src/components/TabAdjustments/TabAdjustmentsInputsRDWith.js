import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsRDWith = (props) => {
  const { appManager } = props;

  const handleRDWithStartYearChange = (e) => appManager.adjustMgr.setRDWithStartYear(e.target.value);
  const handleRDWithEndYearChange = (e) => appManager.adjustMgr.setRDWithEndYear(e.target.value);
  const handleRDWithEndQrtChange = (e) => appManager.adjustMgr.setRDWithEndQrt(e.target.value);
  const handleRDWithStratGenderChange = (e, value) => appManager.adjustMgr.setRDWithStratGender(value);
  const handleRDWithStratTransChange = (e, value) => appManager.adjustMgr.setRDWithStratTrans(value);
  const handleRDWithStratMigrChange = (e, value) => appManager.adjustMgr.setRDWithStratMigr(value);
  const handleRDRestoreDefaults = (e) => appManager.adjustMgr.restoreRDDefaults('withTrend');

  return (
    <React.Fragment>
      <Typography variant='overline'>Reporting Delays - with trend parameters</Typography>
      <form noValidate autoComplete='off' style={{ width: 400 }}>
        <TextField
          label='Diagnosis start year'
          helperText='Enter the start year for diagnosis'
          type='number'
          value={appManager.adjustMgr.rdWithTrendSettings.startYear}
          onChange={handleRDWithStartYearChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <TextField
          label='Notification end year'
          helperText='Enter the end year for notification'
          type='number'
          value={appManager.adjustMgr.rdWithTrendSettings.endYear}
          onChange={handleRDWithEndYearChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <TextField
          label='Notification end quarter (integer between 1 and 4)'
          type='number'
          value={appManager.adjustMgr.rdWithTrendSettings.endQrt}
          onChange={handleRDWithEndQrtChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithTrendSettings.stratGender} onChange={handleRDWithStratGenderChange} name='check' color='primary' />}
            label='Stratify by Gender'
          />
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithTrendSettings.stratTrans} onChange={handleRDWithStratTransChange} name='check' color='primary' />}
            label='Stratify by Transmission'
          />
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithTrendSettings.stratMigr} onChange={handleRDWithStratMigrChange} name='check' color='primary' />}
            label='Stratify by Migration'
          />
        </FormGroup>
        <Button color='primary' onClick={handleRDRestoreDefaults}>Restore defaults</Button>
      </form>
    </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsRDWith);

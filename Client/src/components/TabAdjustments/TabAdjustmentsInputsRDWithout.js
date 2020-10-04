import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const TabAdjustmentsInputsRDWithout = (props) => {
  const { appManager } = props;

  const handleRDWithoutStartYearChange = (e) => appManager.adjustMgr.setRDWithoutStartYear(e.target.value);
  const handleRDWithoutEndYearChange = (e) => appManager.adjustMgr.setRDWithoutEndYear(e.target.value);
  const handleRDWithoutEndQrtChange = (e) => appManager.adjustMgr.setRDWithoutEndQrt(e.target.value);
  const handleRDWithoutStratGenderChange = (e, value) => appManager.adjustMgr.setRDWithoutStratGender(value);
  const handleRDWithoutStratTransChange = (e, value) => appManager.adjustMgr.setRDWithoutStratTrans(value);
  const handleRDWithoutStratMigrChange = (e, value) => appManager.adjustMgr.setRDWithoutStratMigr(value);
  const handleRDRestoreDefaults = (e) => appManager.adjustMgr.restoreRDDefaults('withoutTrend');

  return (
    <React.Fragment>
      <Typography variant='overline'>Reporting Delays - without trend parameters</Typography>
      <form noValidate autoComplete='off' style={{ width: 400 }}>
        <TextField
          label='Diagnosis start year'
          helperText='Enter the start year for diagnosis'
          type='number'
          value={appManager.adjustMgr.rdWithoutTrendSettings.startYear}
          onChange={handleRDWithoutStartYearChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <TextField
          label='Notification end year'
          helperText='Enter the end year for notification'
          type='number'
          value={appManager.adjustMgr.rdWithoutTrendSettings.endYear}
          onChange={handleRDWithoutEndYearChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <TextField
          label='Notification end quarter (integer between 1 and 4)'
          type='number'
          value={appManager.adjustMgr.rdWithoutTrendSettings.endQrt}
          onChange={handleRDWithoutEndQrtChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithoutTrendSettings.stratGender} onChange={handleRDWithoutStratGenderChange} name='check' color='primary' />}
            label='Stratify by Gender'
          />
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithoutTrendSettings.stratTrans} onChange={handleRDWithoutStratTransChange} name='check' color='primary' />}
            label='Stratify by Transmission'
          />
          <FormControlLabel
            control={<Checkbox checked={appManager.adjustMgr.rdWithoutTrendSettings.stratMigr} onChange={handleRDWithoutStratMigrChange} name='check' color='primary' />}
            label='Stratify by Migration'
          />
        </FormGroup>
        <Button color='primary' onClick={handleRDRestoreDefaults}>Restore defaults</Button>
      </form>
    </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsRDWithout);

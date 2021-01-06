import React from 'react';
import { observer } from 'mobx-react';
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
      <form noValidate autoComplete='off' style={{ width: 400 }}>
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
        <TextField
          label='Notification end quarter (integer between 1 and 4)'
          type='number'
          value={appMgr.adjustMgr.rdWithoutTrendSettings.endQrt}
          onChange={handleRDWithoutEndQrtChange}
          fullWidth
          variant='filled'
          style={{ marginBottom: 20 }}
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratGender} onChange={handleRDWithoutStratGenderChange} name='check' color='primary' />}
            label='Stratify by Gender'
          />
          <FormControlLabel
            control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratTrans} onChange={handleRDWithoutStratTransChange} name='check' color='primary' />}
            label='Stratify by Transmission'
          />
          <FormControlLabel
            control={<Checkbox checked={appMgr.adjustMgr.rdWithoutTrendSettings.stratMigr} onChange={handleRDWithoutStratMigrChange} name='check' color='primary' />}
            label='Stratify by Migration'
          />
        </FormGroup>
        <Button color='primary' onClick={handleRDRestoreDefaults}>Restore defaults</Button>
      </form>
    </React.Fragment>
  )
};

export default observer(TabAdjustmentsInputsRDWithout);

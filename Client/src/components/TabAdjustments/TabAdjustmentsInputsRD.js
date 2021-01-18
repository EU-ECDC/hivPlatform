import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import TabAdjustmentsInputsRDNone from './TabAdjustmentsInputsRDNone';
import TabAdjustmentsInputsRDWithout from './TabAdjustmentsInputsRDWithout';
import TabAdjustmentsInputsRDWith from './TabAdjustmentsInputsRDWith';

const TabAdjustmentsInputsRD = (props) => {
  const { appMgr } = props;

  const handleDataSelection = (e) => appMgr.adjustMgr.setRDAdjustType(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={2}>
        Reporting Delays type:<br />
        <FormControl component='fieldset'>
          <RadioGroup
            name='rdAdjustType'
            value={appMgr.adjustMgr.rdAdjustType}
            onChange={handleDataSelection}
          >
            <FormControlLabel
              value='none'
              control={<Radio color='primary' size='small' />}
              label='None'
            />
            <FormControlLabel
              value='withoutTrend'
              control={<Radio color='primary' size='small' />}
              label='Without trend'
            />
            <FormControlLabel
              value='withTrend'
              control={<Radio color='primary' size='small' />}
              label='With trend'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={10}>
        <Paper style={{ padding: 10, minHeight: 263 }}>
          {appMgr.adjustMgr.rdAdjustType === 'none' && <TabAdjustmentsInputsRDNone />}
          {appMgr.adjustMgr.rdAdjustType === 'withoutTrend' && <TabAdjustmentsInputsRDWithout {...props} />}
          {appMgr.adjustMgr.rdAdjustType === 'withTrend' && <TabAdjustmentsInputsRDWith {...props} />}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default observer(TabAdjustmentsInputsRD);

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TabAdjustmentsInputsRDNone from './TabAdjustmentsInputsRDNone';
import TabAdjustmentsInputsRDWithout from './TabAdjustmentsInputsRDWithout';
import TabAdjustmentsInputsRDWith from './TabAdjustmentsInputsRDWith';

const TabAdjustmentsInputsRD = (props) => {
  const { appManager } = props;

  const handleDataSelection = (e) => appManager.adjustMgr.setRDAdjustType(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography color='textSecondary'>
          Reporting Delays adjustment
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='rdAdjustType'
            value={appManager.adjustMgr.rdAdjustType}
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
      <Grid item xs={9}>
        <Paper style={{ padding: 10, minHeight: 455 }}>
          {appManager.adjustMgr.rdAdjustType === 'none' && <TabAdjustmentsInputsRDNone />}
          {appManager.adjustMgr.rdAdjustType === 'withoutTrend' && <TabAdjustmentsInputsRDWithout appManager={appManager} />}
          {appManager.adjustMgr.rdAdjustType === 'withTrend' && <TabAdjustmentsInputsRDWith appManager={appManager} />}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default observer(TabAdjustmentsInputsRD);

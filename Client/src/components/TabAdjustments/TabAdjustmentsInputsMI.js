import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TabAdjustmentsInputsMINone from './TabAdjustmentsInputsMINone';
import TabAdjustmentsInputsMIJomo from './TabAdjustmentsInputsMIJomo';
import TabAdjustmentsINputsMIMice from './TabAdjustmentsInputsMIMice';

const TabAdjustmentsInputsMI = (props) => {
  const { appManager } = props;

  const handleDataSelection = (e) => appManager.adjustMgr.setMIAdjustType(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={3}>
        <Typography color='textSecondary'>
          Multiple Imputations adjustment
        </Typography>
        <FormControl component='fieldset'>
          <RadioGroup
            name='miAdjustType'
            value={appManager.adjustMgr.miAdjustType}
            onChange={handleDataSelection}
          >
            <FormControlLabel
              value='none'
              control={<Radio color='primary' size='small' />}
              label='None'
            />
            <FormControlLabel
              value='jomo'
              control={<Radio color='primary' size='small' />}
              label='Joint Modelling - JOMO'
            />
            <FormControlLabel
              value='mice'
              control={<Radio color='primary' size='small' />}
              label='Chained Equations - MICE'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <Paper style={{ padding: 10, minHeight: 476 }}>
          {appManager.adjustMgr.miAdjustType === 'none' && <TabAdjustmentsInputsMINone />}
          {appManager.adjustMgr.miAdjustType === 'jomo' && <TabAdjustmentsInputsMIJomo appManager={appManager} />}
          {appManager.adjustMgr.miAdjustType === 'mice' && <TabAdjustmentsINputsMIMice appManager={appManager} />}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default observer(TabAdjustmentsInputsMI);

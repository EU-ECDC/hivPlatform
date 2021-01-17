import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import TabAdjustmentsInputsMINone from './TabAdjustmentsInputsMINone';
import TabAdjustmentsInputsMIJomo from './TabAdjustmentsInputsMIJomo';
import TabAdjustmentsINputsMIMice from './TabAdjustmentsInputsMIMice';

const TabAdjustmentsInputsMI = (props) => {
  const { appMgr } = props;

  const handleDataSelection = (e) => appMgr.adjustMgr.setMIAdjustType(e.target.value);

  return (
    <React.Fragment>
      <Grid item xs={2}>
        Multiple Imputations type:
        <FormControl component='fieldset'>
          <RadioGroup
            name='miAdjustType'
            value={appMgr.adjustMgr.miAdjustType}
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
      <Grid item xs={10}>
        <Paper style={{ padding: 10, minHeight: 283 }}>
          {appMgr.adjustMgr.miAdjustType === 'none' && <TabAdjustmentsInputsMINone />}
          {appMgr.adjustMgr.miAdjustType === 'jomo' && <TabAdjustmentsInputsMIJomo {...props} />}
          {appMgr.adjustMgr.miAdjustType === 'mice' && <TabAdjustmentsINputsMIMice {...props} />}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default observer(TabAdjustmentsInputsMI);

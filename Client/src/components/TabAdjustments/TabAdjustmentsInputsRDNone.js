import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';

const TabAdjustmentsInputsRDNone = () => (
  <React.Fragment>
    <Typography variant='overline'>No parameters</Typography>
    <Typography>
      No Reporting Delays adjustment selected
      </Typography>
  </React.Fragment>
);

export default observer(TabAdjustmentsInputsRDNone);

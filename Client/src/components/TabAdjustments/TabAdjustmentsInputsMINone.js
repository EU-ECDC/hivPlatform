import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';

const TabAdjustmentsInputsMINone = () => (
    <React.Fragment>
      <Typography variant='overline'>No parameters</Typography>
      <Typography>
        No Multiple Imputations adjustment selected
      </Typography>
    </React.Fragment>
  )
;

export default observer(TabAdjustmentsInputsMINone);

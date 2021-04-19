import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import IsNull from '../../utilities/IsNull';
import Typography from '@material-ui/core/Typography';
import SmallTable from './SmallTable';

const TabModellingOutputsTables = props => {

  const { appMgr } = props;
  if (IsNull(appMgr.modelMgr.plotData)) {
    return (null);
  }

  return (
    <Grid container spacing={2} style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          A. Main results
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SmallTable
          tableData={appMgr.modelMgr.mainOutputTableData}
          maxHeight={'100%'}
        />
      </Grid>
    </Grid>
  );
};

export default observer(TabModellingOutputsTables);

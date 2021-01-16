import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';
import Btn from '../Btn';
import OriginGroupingsWidget from './OriginGroupingsWidget';
import MessageAlert from '../MessageAlert';

const OriginGroupings = (props) => {
  const { appMgr } = props;

  const onApplyClick = () => appMgr.origGroupMgr.applyGroupings();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          Migrant variable regrouping
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Btn style={{ marginBottom: 6 }} onClick={onApplyClick}>
          <GroupIcon />&nbsp;Apply regrouping
        </Btn>
        <Typography variant='body2' color='textSecondary'>
          Migrant variable can be created by grouping regions.<br />
          Choose present or define custom grouping and press 'Apply regrouping' button.
        </Typography>
        <MessageAlert
          valid={appMgr.origGroupMgr.actionValid}
          msg={appMgr.origGroupMgr.actionMessage}
        />
      </Grid>
      <Grid item xs={10}>
        <OriginGroupingsWidget {...props} />
      </Grid>
    </Grid>
  )
};

export default observer(OriginGroupings);

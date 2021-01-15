import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import Btn from '../Btn';
import OriginGroupingsWidget from './OriginGroupingsWidget';
import MessageAlert from '../MessageAlert';

const OriginGroupings = (props) => {
  const { appMgr } = props;

  const onApplyClick = () => appMgr.origGroupMgr.applyGroupings();

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Btn style={{ marginBottom: 6 }} onClick={onApplyClick}>
          <GroupIcon />&nbsp;Apply regrouping
        </Btn>
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

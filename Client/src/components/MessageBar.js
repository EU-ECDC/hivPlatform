import React from 'react';
import { observer } from 'mobx-react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { NOTIFICATION_DURATION } from '../settings';

const MessageBar = (props) => {
  const { notificationsMgr } = props;

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    notificationsMgr.clearMsg();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={notificationsMgr.hasMsg}
      autoHideDuration={NOTIFICATION_DURATION}
      onClose={handleClose}
      message={notificationsMgr.msgInfo.msg}
      action={
        <React.Fragment>
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

export default observer(MessageBar);

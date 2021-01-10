import React from 'react';
import Alert from '@material-ui/lab/Alert';
import IsNull from '../utilities/IsNull';

const MessageAlert = (props) => {
  const { status, msg, ...rest } = props;
  if (IsNull(status)) return null;

  const severity = status === 'SUCCESS' ? 'success' : 'error';

  return (
    <Alert severity={severity} {...rest} style={{ marginTop: 10 }}>
      {msg}
    </Alert>
  );
};

export default MessageAlert;

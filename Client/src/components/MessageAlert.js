import React from 'react';
import Alert from '@mui/material/Alert';
import IsNull from '../utilities/IsNull';

const MessageAlert = (props) => {
  const { valid, msg, ...rest } = props;
  if (IsNull(valid)) return null;

  const severity = valid ? 'success' : 'error';

  return (
    <Alert severity={severity} {...rest} style={{ marginTop: 10 }}>
      {msg}
    </Alert>
  );
};

export default MessageAlert;

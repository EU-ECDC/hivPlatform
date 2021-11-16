import React from 'react';
import { observer } from 'mobx-react';
import TextField from '@mui/material/TextField';

const ValidationTextField = (props) => {
  const { onChange, validationFunc, helperText: propsHelperText, ...restProps } = props;
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const handleValueChange = e => {
    const { value } = e.target;

    const errorText = validationFunc(value);
    const error = errorText !== propsHelperText;
    const valid = !error;

    setError(error);
    setErrorText(errorText);

    if (onChange) {
      onChange(value, valid);
    }
  };

  const helperText = errorText || propsHelperText;

  return (
    <TextField
      {...restProps}
      error={error}
      helperText={helperText}
      onChange={handleValueChange}
      inputProps={{
        autoComplete: 'new-password',
        form: {
          autoComplete: 'off',
        },
      }}
    />
  );
}

export default observer(ValidationTextField);

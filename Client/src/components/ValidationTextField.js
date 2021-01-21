import React from 'react';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';

const ValidationTextField = (props) => {
  // state = {
  //   error: false,
  //   errorText: '',
  // };

  // static getDerivedStateFromProps(props) {
  //   if (props.value) {
  //     const errorText = props.validationFunc(props.value);
  //     return {
  //       error: errorText !== props.helperText,
  //       errorText,
  //     };
  //   }
  //   return null;
  // }

  // handleValueChange = event => {
  //   const { value } = event.target;
  //   const {
  //     onChange,
  //     validationFunc,
  //     helperText: propsHelperText,
  //   } = this.props;

  //   const errorText = validationFunc(value);
  //   const error = errorText !== propsHelperText;
  //   const valid = !error;

  //   this.setState({ error, errorText });

  //   if (onChange) {
  //     onChange(value, valid);
  //   }
  // };

  const { onChange, validationFunc, helperText: propsHelperText, ...restProps } = this.props;
  // const { error, errorText } = this.state;

  const helperText = errorText || propsHelperText;

  return (
    <TextField
      {...restProps}
      error={error}
      helperText={helperText}
      onChange={this.handleValueChange}
    />
  );
}

export default observer(ValidationTextField);

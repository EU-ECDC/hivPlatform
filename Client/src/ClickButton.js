import React from 'react';
import Button from '@material-ui/core/Button';

export default class ClickButton extends React.Component {
  state = {
    message: 'Click me',
  };

  componentDidMount() {
    window.Shiny.addCustomMessageHandler('foo2', message =>
      this.setState({ message })
    )
  }

  render() {
    return(
      <Button onClick={() => window.Shiny.setInputValue('foo', 'I\'m coming from React!')} >
        {this.state.message}
      </Button>
    )
  }

}

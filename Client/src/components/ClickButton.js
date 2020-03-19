import React from 'react';
import { observer, inject } from 'mobx-react';
import Button from '@material-ui/core/Button';


@observer
export default class ClickButton extends React.Component {
  state = {
    caption: 'Click me',
  };

  handleClick = () => this.props.appManager.btnClicked('ClickButton');

  render() {
    const {caption}= this.state;

    return(
      <Button onClick={this.handleClick}>
        {caption}
      </Button>
    )
  }
}

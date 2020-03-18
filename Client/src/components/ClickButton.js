import React from 'react';
import { observer, inject } from 'mobx-react';
import Button from '@material-ui/core/Button';

@inject('appManager')
@observer
export default class ClickButton extends React.Component {
  state = {
    message: 'Click me',
  };

  handleClick = () => {
    const { appManager } = this.props;
    appManager.notifyShinyBtnClicked('ClickButton');
  }

  render() {
    return(
      <Button onClick={this.handleClick}>
        {this.state.message}
      </Button>
    )
  }
}

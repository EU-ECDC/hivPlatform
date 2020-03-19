import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import LeftNav from './LeftNav';
import { NAME, VERSION } from '../settings';

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 10,
    color: 'white',
  },
  appBar: {
    padding: 3,
  },
  appName: {
    color: 'white',
  },
  appVersion: {
    color: 'white',
    marginRight: 10,
  },
  grow: {
    flexGrow: 1,
  },
});

const steps = ['Input data upload', 'Data summary', 'Adjustments'];
@withStyles(styles)
@inject('appManager')
@observer
class RootElem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    leftNavOpen: false,
    tabIndex: 0,
  };

  setLeftNavOpen = open => {
    this.setState({ leftNavOpen: open });
  };

  handleOpenLeftNav = () => this.setLeftNavOpen(true);

  handleCloseLeftNav = () => this.setLeftNavOpen(false);

  handleTabChange = tabIndex => {
    console.log(tabIndex);
    this.setState({tabIndex})
  }

  render() {
    const { classes } = this.props;
    const { leftNavOpen } = this.state;

    const appBar = (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense" disableGutters>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={this.handleOpenLeftNav}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.appName}>
            {NAME}
          </Typography>
          <div className={classes.grow} />
          <Typography variant="subtitle1" className={classes.appVersion}>
            | v. {VERSION}
          </Typography>
        </Toolbar>
      </AppBar>
    );
    const leftNav = (
//      <Drawer variant="persistent" open={leftNavOpen} onClose={this.handleCloseLeftNav}>
        <LeftNav steps={steps} onStepChange={this.handleTabChange}/>
//      </Drawer>
    );;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          {appBar}
          <Grid container className={classes.grow}>
            <Grid item xs={3}>{leftNav}</Grid>
            <Grid item xs={9}>
            <TabPanel value={this.state.tabIndex} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={this.state.tabIndex} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={this.state.tabIndex} index={2}>
              Item Three
            </TabPanel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default RootElem;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import TabWelcome from './TabWelcome';
import TabUpload from './TabUpload/TabUpload';
import TabSummary from './TabSummary';
import TabAdjustments from './TabAdjustments/TabAdjustments';
import TabModelling from './TabModelling/TabModelling';
import TabReports from './TabReports';
import TabOutputs from './TabOutputs';
import MessageBar from './MessageBar';
import { NAME, VERSION } from '../settings';

const userStyles = makeStyles({
  appBar: {
    padding: 3,
    backgroundColor: 'inherent'
  },
  appName: {
    color: 'white',
    marginLeft: 10,
  },
  appVersion: {
    color: 'white',
    marginRight: 10,
  },
  rightNavBtn: {
    color: 'white'
  }
});

const StepPanel = props => {
  const { activePanelId, panelId, children, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={activePanelId !== panelId}
      id={`wrapped-tabpanel-${panelId}`}
      aria-labelledby={`wrapped-tab-${panelId}`}
      style={{ flexGrow: 1, overflowY: 'scroll' }}
      {...other}
    >
      {activePanelId === panelId && <Box p={2}>{children}</Box>}
    </Typography>
  );
};

const RootElem = props => {
  const appMgr = props.appMgr;
  const classes = userStyles();
  const [rightNavState, setRightNavState] = React.useState(false);

  const appBar = (
    <AppBar position='static' className={classes.appBar}>
      <Toolbar variant='dense' disableGutters>
        <Typography variant='h6' className={classes.appName}>
          {NAME}
        </Typography>
        <Box flexGrow={1}/>
        <Typography variant='subtitle1' className={classes.appVersion}>
          {appMgr.shinyReady} Engine state: {appMgr.shinyState} | Version {VERSION}
        </Typography>
        <IconButton onClick={() => setRightNavState(!rightNavState)} className={classes.rightNavBtn}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const handleStepChange = stepId => {
    appMgr.uiStateMgr.setActiveStepId(stepId);
  }

  const handleSubStepChange = (stepId, subStepId) => {
    appMgr.uiStateMgr.setActiveSubStepId(stepId, subStepId);
  }

  return (
    <Box display='flex' flexGrow={1} flexDirection='column' style={{overflow: 'hidden'}} p={0}>
      <RightNav open={rightNavState} onClose={() => setRightNavState(false)}/>
      {appBar}
      <Box display='flex' flexGrow={1} flexDirection='row' style={{overflow: 'hidden'}} p={0}>
        <LeftNav
          steps={appMgr.uiStateMgr.steps}
          activeStepId={appMgr.uiStateMgr.activeStepId}
          onStepChange={handleStepChange}
          onSubStepChange={handleSubStepChange}
        />
        <StepPanel panelId={0} activePanelId={appMgr.uiStateMgr.activeStepId} >
          <TabWelcome appMgr={appMgr}/>
        </StepPanel>
        <StepPanel panelId={1} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabUpload appMgr={appMgr} />
        </StepPanel>
        <StepPanel panelId={2} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabSummary appMgr={appMgr} />
        </StepPanel>
        <StepPanel panelId={3} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabAdjustments appMgr={appMgr} />
        </StepPanel>
        <StepPanel panelId={4} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabModelling appMgr={appMgr} />
        </StepPanel>
        <StepPanel panelId={5} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabReports appMgr={appMgr}/>
        </StepPanel>
        <StepPanel panelId={6} activePanelId={appMgr.uiStateMgr.activeStepId}>
          <TabOutputs />
        </StepPanel>
      </Box>
      <MessageBar notificationsMgr={appMgr.notificationsMgr} />
    </Box>
  );
};

export default inject('appMgr')(observer(RootElem));

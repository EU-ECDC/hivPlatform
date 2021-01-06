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
      {activePanelId === panelId && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

const RootElem = props => {
  const appManager = props.appManager;
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
          {appManager.shinyReady} Engine state: {appManager.shinyState} | Version {VERSION}
        </Typography>
        <IconButton onClick={() => setRightNavState(!rightNavState)} className={classes.rightNavBtn}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const handleStepChange = stepId => {
    appManager.setActiveStepId(stepId);
  }

  const handleSubStepChange = (stepId, subStepId) => {
    appManager.setActiveSubStepId(stepId, subStepId);
  }

  return (
    <Box display='flex' flexGrow={1} flexDirection='column' style={{overflow: 'hidden'}}>
      <RightNav open={rightNavState} onClose={() => setRightNavState(false)}/>
      {appBar}
      <Box display='flex' flexGrow={1} flexDirection='row' style={{overflow: 'hidden'}}>
        <LeftNav
          steps={appManager.steps}
          activeStepId={appManager.activeStepId}
          onStepChange={handleStepChange}
          onSubStepChange={handleSubStepChange}
        />
        <StepPanel panelId={0} activePanelId={appManager.activeStepId} >
          <TabWelcome appManager={appManager}/>
        </StepPanel>
        <StepPanel panelId={1} activePanelId={appManager.activeStepId}>
          <TabUpload appManager={appManager} />
        </StepPanel>
        <StepPanel panelId={2} activePanelId={appManager.activeStepId}>
          <TabSummary appManager={appManager} />
        </StepPanel>
        <StepPanel panelId={3} activePanelId={appManager.activeStepId}>
          <TabAdjustments appManager={appManager} />
        </StepPanel>
        <StepPanel panelId={4} activePanelId={appManager.activeStepId}>
          <TabModelling appManager={appManager} />
        </StepPanel>
        <StepPanel panelId={5} activePanelId={appManager.activeStepId}>
          <TabReports appManager={appManager}/>
        </StepPanel>
        <StepPanel panelId={6} activePanelId={appManager.activeStepId}>
          <TabOutputs />
        </StepPanel>
      </Box>
      <MessageBar notificationsMgr={appManager.notificationsMgr} />
    </Box>
  );
};

export default inject('appManager')(observer(RootElem));

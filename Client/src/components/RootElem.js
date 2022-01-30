import React from 'react';
import { observer, inject } from 'mobx-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import TabWelcome from './TabWelcome';
import TabUpload from './TabUpload/TabUpload';
import TabSummary from './TabSummary/TabSummary';
import TabAdjustments from './TabAdjustments/TabAdjustments';
import TabMigrant from './TabMigrant/TabMigrant';
import TabModelling from './TabModelling/TabModelling';
import TabReports from './TabReports';
import TabOutputs from './TabOutputs';
import MessageBar from './MessageBar';
import { NAME, VERSION, DEBUG } from '../settings';

const Page = ({ pageId, activePageId, children, ...other }) => (
  <Typography
    component='div'
    role='tabpanel'
    hidden={activePageId !== pageId}
    id={`wrapped-tabpanel-${pageId}`}
    aria-labelledby={`wrapped-tab-${pageId}`}
    style={{ flexGrow: 1, overflowY: 'scroll' }}
    {...other}
  >
    {activePageId === pageId && <Box p={2}>{children}</Box>}
  </Typography>
);

const RootElem = props => {
  const { appMgr } = props;
  const [rightNavState, setRightNavState] = React.useState(false);

  if (!DEBUG) {
    const confirmExit = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    React.useEffect(() => {
      window.addEventListener('beforeunload', confirmExit);
      return () => window.removeEventListener('beforeunload', confirmExit);
    }, []);
  }

  const bgColor = appMgr.shinyReady ? '#69b023' : '#f44336';

  const appBar = (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: `${bgColor}`
      }}
    >
      <Toolbar variant='dense' disableGutters>
        <Typography variant='h6' sx={{ color: 'white', ml: '10px'}}>
          {NAME}
        </Typography>
        <Typography variant='subtitle1' sx={{ color: 'white' }}>
          &nbsp;| version {VERSION}
        </Typography>
        <Box flexGrow={1}/>
        <Typography variant='subtitle1' sx={{ color: 'white' }}>
          Engine state: {appMgr.shinyStateHuman}
        </Typography>
        <IconButton
          onClick={() => setRightNavState(!rightNavState)}
          size='large'
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  const handlePageChange = (pageId, subPageId) => {
    appMgr.uiStateMgr.setActivePageId(pageId, subPageId);
  };

  return (
    <Box
      display='flex'
      flexGrow={1}
      flexDirection='column'
      sx={{ overflow: 'hidden' }}
      p={0}
    >
      <RightNav {...props} open={rightNavState} onClose={() => setRightNavState(false)}/>
      {appBar}
      <Box
        display='flex'
        flexGrow={1}
        flexDirection='row'
        sx={{ overflow: 'hidden', backgroundColor: '#fafafa' }}
        p={0}
      >
        <LeftNav
          pages={appMgr.uiStateMgr.pages}
          activePageId={appMgr.uiStateMgr.activePageId}
          onPageChange={handlePageChange}
        />
        <Page pageId={0} activePageId={appMgr.uiStateMgr.activePageId} >
          <TabWelcome {...props} />
        </Page>
        <Page pageId={1} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabUpload {...props} />
        </Page>
        <Page pageId={2} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabSummary {...props} />
        </Page>
        <Page pageId={3} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabAdjustments {...props} />
        </Page>
        <Page pageId={4} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabMigrant {...props} />
        </Page>
        <Page pageId={5} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabModelling {...props} />
        </Page>
        <Page pageId={6} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabReports {...props} />
        </Page>
        <Page pageId={7} activePageId={appMgr.uiStateMgr.activePageId}>
          <TabOutputs {...props} />
        </Page>
      </Box>
      <MessageBar notificationsMgr={appMgr.notificationsMgr} />
    </Box>
  );
};

export default inject('appMgr')(observer(RootElem));

import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import TabPanel from './TabPanel';
import Btn from './Btn';
import IsNull from '../utilities/IsNull';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10,
    marginBottom: 10,
    height: 10,
  }
}));

const MigrantRunProgressBar = (props) => {
  const { progress } = props;
  if (IsNull(progress)) return null;

  const classes = useStyles();

  return <LinearProgress color='secondary' className={classes.root}/>
};

const TabMigrant = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4);

  const handleRunBtnClick = () => appMgr.migrMgr.run();

  const handleCancelBtnClick = () => appMgr.migrMgr.cancel();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size='small'
              color='primary'
              disabled={true}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Migrant modelling run
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Btn
            onClick={handleRunBtnClick}
            disabled={appMgr.migrMgr.runInProgress}
          >
            <DirectionsRunIcon />&nbsp;Run migration
          </Btn>
          <Button
            onClick={handleCancelBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.migrMgr.runInProgress}
          >
            Cancel
          </Button>
          <MigrantRunProgressBar progress={appMgr.migrMgr.runProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <pre
              dangerouslySetInnerHTML={{ __html: appMgr.migrMgr.runLog }}
              style={{ overflowX: 'auto', fontSize: '0.75rem' }}
            />
          </Paper>
        </Grid>

      </Grid>
    </TabPanel>
  );
};

export default observer(TabMigrant);

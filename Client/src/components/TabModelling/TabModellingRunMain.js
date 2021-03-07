import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import IsNull from '../../utilities/IsNull';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10,
    marginBottom: 10,
    height: 10,
  }
}));

const ModelRunProgressBar = (props) => {
  const { progress } = props;
  if (IsNull(progress)) return null;

  const classes = useStyles();

  return <LinearProgress color='secondary' className={classes.root} />
};

const TabModellingRunMain = props => {
  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 4);

  const handleRunModelsBtnClick = () => {
    appMgr.modelMgr.runModels();
  };

  const handleCancelModelsBtnClick = () => {
    appMgr.modelMgr.cancelModels();
  };

  const handleSelectedPopCombId = e => {
    appMgr.popCombMgr.setSelectedCombination(e.target.value);
  };

  const handleSelectedCollectionId = e => {
    appMgr.modelMgr.timeIntCollMgr.setSelectedRunCollectionId(e.target.value);
  };

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.uiStateMgr.bootstrapEnabled}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Perform main fit of HIV model
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <FormControl style={{ width: '100%', marginTop: 20 }}>
            <Select
              value={appMgr.popCombMgr.selectedCombination.id}
              onChange={handleSelectedPopCombId}
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              {appMgr.popCombMgr.combinationsArray.map(el =>
                <MenuItem key={el.id} value={el.id} dense>{el.name}</MenuItem>
              )}
            </Select>
            <FormHelperText>Select population</FormHelperText>
          </FormControl>
          <FormControl style={{ width: '100%', marginTop: 20, marginBottom: 20 }}>
            <Select
              value={appMgr.modelMgr.timeIntCollMgr.selectedRunCollectionId}
              onChange={handleSelectedCollectionId}
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              {appMgr.modelMgr.timeIntCollMgr.collectionsArray.map((el, i) =>
                <MenuItem key={i} value={el.id} dense>{el.name}</MenuItem>
              )}
            </Select>
            <FormHelperText>
              Select time intervals and diagnosis rates modelling matrix
            </FormHelperText>
          </FormControl>
          <Btn
            onClick={handleRunModelsBtnClick}
            disabled={appMgr.modelMgr.modelsRunInProgress}
          >
            &nbsp;Run main model
          </Btn>
          <Button
            onClick={handleCancelModelsBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.modelMgr.modelsRunInProgress}
          >
            Cancel
          </Button>
          <ModelRunProgressBar progress={appMgr.modelMgr.modelsRunProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre
              dangerouslySetInnerHTML={{ __html: appMgr.modelMgr.modelsRunLog }}
              style={{ overflowX: 'auto' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingRunMain);

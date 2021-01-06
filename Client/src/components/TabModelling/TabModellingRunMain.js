import React from 'react';
import { observer } from 'mobx-react';
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

const ModelRunProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress color='secondary' variant='determinate' value={progress} />
};

const TabModellingRunMain = props => {
  const { appMgr } = props;

  const handleRunModelsBtnClick = () => {
    appMgr.modelMgr.runModels();
  };

  const handleCancelModelsBtnClick = () => {
    appMgr.modelMgr.cancelModels();
  };

  const handleSelectedPopCombName = e => {
    appMgr.popCombMgr.setSelectedCombinationName(e.target.value);
  };

  const handleSelectedCollectionId = e => {
    appMgr.modelMgr.timeIntCollMgr.setSelectedRunCollectionId(e.target.value);
  };

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Perform main fit of HIV model
          </Typography>
          <FormControl style={{ width: '100%', marginTop: 20 }}>
            <Select
              value={appMgr.popCombMgr.selectedCombinationName}
              onChange={handleSelectedPopCombName}
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              {appMgr.popCombMgr.combinationsNames.map((combName, i) =>
                <MenuItem key={i} value={combName} dense>{combName}</MenuItem>
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
            <FormHelperText>Select time intervals and diagnosis rates modelling matrix</FormHelperText>
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
        <Grid item xs={9}>
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

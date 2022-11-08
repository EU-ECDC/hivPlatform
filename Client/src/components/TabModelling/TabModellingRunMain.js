import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import ProgressBar from '../ProgressBar';

const TabModellingRunMain = props => {
  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 4);

  const handleMigrConnFlagChange = e => appMgr.modelMgr.setMigrConnFlag(e.target.value === 'true');

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
          <Typography variant='body2' color='textSecondary'>
            1. Migrant connection
          </Typography>
          <RadioGroup
            row
            value={appMgr.modelMgr.migrConnFlag}
            onChange={handleMigrConnFlagChange}
          >
            <FormControlLabel value={true} control={<Radio color='primary' size='small' />} label='Yes' />
            <FormControlLabel value={false} control={<Radio color='primary' size='small' />} label='No' />
          </RadioGroup>
          <FormHelperText>
            Enable alternative HIV modelling processing with migrant status information used.
          </FormHelperText>
          <Typography variant='body2' color='textSecondary' style={{ marginTop: 20 }}>
            2. Population
          </Typography>
          <FormControl style={{ width: '100%'}}>
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
          <Typography variant='body2' color='textSecondary' style={{ width: '100%', marginTop: 20 }}>
            3. Time intervals and diagnosis rates
          </Typography>
          <FormControl style={{ marginBottom: 20 }}>
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
          <ProgressBar progress={appMgr.modelMgr.modelsRunProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre
              dangerouslySetInnerHTML={{ __html: appMgr.modelMgr.modelsRunLog }}
              style={{ overflowX: 'auto', fontSize: '0.75rem' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingRunMain);

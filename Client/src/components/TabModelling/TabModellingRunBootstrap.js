import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import ProgressBar from '../ProgressBar';

const TabModellingRunBootstrap = props => {
  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(4, 5);
  const handleRunBootstrapBtnClick = () => appMgr.modelMgr.runBootstrap();
  const handleCancelBootstrapBtnClick = () => appMgr.modelMgr.cancelBootstrap();
  const handleBootstrapCountChange = e => appMgr.modelMgr.setBootstrapCount(e.target.value);
  const handleBootstrapTypeChange = e => appMgr.modelMgr.setBootstrapType(e.target.value);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.uiStateMgr.modellingOutputsEnabled}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Perform bootstrap fit of HIV model
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <FormControl style={{ width: '100%', marginTop: 20 }}>
            <Input
              style={{ width: '100%', fontSize: '0.75rem' }}
              value={appMgr.modelMgr.bootstrapCount}
              onChange={handleBootstrapCountChange}
              type='number'
            />
            <FormHelperText>Set the number of iterations</FormHelperText>
          </FormControl>
          <FormControl
            sx={{
              marginTop: '20px',
              marginBottom: '20px',
              width: '100%'
            }}
          >
            <RadioGroup
              row
              value={appMgr.modelMgr.bootstrapType}
              onChange={handleBootstrapTypeChange}
            >
              <FormControlLabel
                value='PARAMETRIC'
                control={<Radio color="primary" />}
                label='Parametric'
                sx={{
                  '& span': {
                    fontSize: '0.75rem'
                  }
                }}
              />
              <FormControlLabel
                value='NON-PARAMETRIC'
                control={<Radio color="primary" />}
                label='Non-parametric'
                disabled={!appMgr.uiStateMgr.nonParametricBootstrapEnabled}
                sx={{
                  '& span': {
                    fontSize: '0.75rem'
                  }
                }}
              />
            </RadioGroup>
            <FormHelperText>Set the bootstrap type</FormHelperText>
          </FormControl>
          <Btn
            onClick={handleRunBootstrapBtnClick}
            disabled={appMgr.modelMgr.bootstrapRunInProgress}
          >
            Run bootstrap
          </Btn>
          <Button
            onClick={handleCancelBootstrapBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.modelMgr.bootstrapRunInProgress}
          >
            Cancel
          </Button>
          <ProgressBar progress={appMgr.modelMgr.bootstrapRunProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre
              dangerouslySetInnerHTML={{ __html: appMgr.modelMgr.bootstrapRunLog }}
              style={{ overflowX: 'auto', fontSize: '0.75rem' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingRunBootstrap);

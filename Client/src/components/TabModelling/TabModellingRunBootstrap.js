import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TabPanel from '../TabPanel';
import Btn from '../Btn';

const userStyles = makeStyles({
  btRoot: {
    marginTop: 20
  },
  btOption: {
    '& span': {
      fontSize: '0.75rem'
    }
  }
});

const ModelRunProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress color='secondary' variant='determinate' value={progress} />
};

const TabModellingRunBootstrap = props => {
  const { appManager } = props;
  const classes = userStyles();

  const handleRunBootstrapBtnClick = () => appManager.modelMgr.runBootstrap();
  const handleCancelBootstrapBtnClick = () => appManager.modelMgr.cancelBootstrap();
  const handleBootstrapCountChange = e => appManager.modelMgr.setBootstrapCount(e.target.value);
  const handleBootstrapTypeChange = e => appManager.modelMgr.setBootstrapType(e.target.value);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Btn onClick={handleRunBootstrapBtnClick}><DirectionsRunIcon />&nbsp;Run bootstrap</Btn>
          <Button
            onClick={handleCancelBootstrapBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
          >
            Cancel
          </Button>
          <ModelRunProgressBar progress={appManager.modelMgr.bootstrapRunProgress} />
          <FormControl style={{ width: '100%', marginTop: 20 }}>
            <Input
              style={{ width: '100%', fontSize: '0.75rem' }}
              value={appManager.modelMgr.bootstrapCount}
              onChange={handleBootstrapCountChange}
              type='number'
            />
            <FormHelperText>Set the number of iterations</FormHelperText>
          </FormControl>
          <FormControl className={classes.btRoot}>
            <RadioGroup
              row
              value={appManager.modelMgr.bootstrapType}
              onChange={handleBootstrapTypeChange}
            >
              <FormControlLabel
                value='CASE-BASED'
                control={<Radio color="primary"/>}
                label='Case-based'
                className={classes.btOption}
              />
              <FormControlLabel
                value='AGGREGATED'
                control={<Radio color="primary" />}
                label='Aggregated'
                className={classes.btOption}
              />
            </RadioGroup>
            <FormHelperText>Set the bootstrap type</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre>
              {appManager.modelMgr.bootstrapRunLog}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingRunBootstrap);

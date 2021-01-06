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
    marginTop: 20,
    marginBottom: 20,
    width: '100%'
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
  const { appMgr } = props;
  const classes = userStyles();

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
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Perform bootstrap fit of HIV model
          </Typography>
          <FormControl style={{ width: '100%', marginTop: 20 }}>
            <Input
              style={{ width: '100%', fontSize: '0.75rem' }}
              value={appMgr.modelMgr.bootstrapCount}
              onChange={handleBootstrapCountChange}
              type='number'
            />
            <FormHelperText>Set the number of iterations</FormHelperText>
          </FormControl>
          <FormControl className={classes.btRoot}>
            <RadioGroup
              row
              value={appMgr.modelMgr.bootstrapType}
              onChange={handleBootstrapTypeChange}
            >
              <FormControlLabel
                value='NON-PARAMETRIC'
                control={<Radio color="primary" />}
                label='Non-parametric'
                className={classes.btOption}
              />
              <FormControlLabel
                value='PARAMETRIC'
                control={<Radio color="primary" />}
                label='Parametric'
                className={classes.btOption}
              />
            </RadioGroup>
            <FormHelperText>Set the bootstrap type</FormHelperText>
          </FormControl>
          <Btn onClick={handleRunBootstrapBtnClick}><DirectionsRunIcon />&nbsp;Run bootstrap</Btn>
          <Button
            onClick={handleCancelBootstrapBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
          >
            Cancel
          </Button>
          <ModelRunProgressBar progress={appMgr.modelMgr.bootstrapRunProgress} />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Run log</Typography>
            <pre
              dangerouslySetInnerHTML={{ __html: appMgr.modelMgr.bootstrapRunLog }}
              style={{ overflowX: 'auto' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingRunBootstrap);

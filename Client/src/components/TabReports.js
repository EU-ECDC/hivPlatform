import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import TabPanel from './TabPanel';
import Btn from './Btn';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 10,
    marginBottom: 10,
    height: 10,
  }
}));

const ReportsProgressBar = (props) => {
  const { progress } = props;
  if (!progress) return null;

  const classes = useStyles();

  return <LinearProgress color='secondary' className={classes.root} />
};

const TabReports = (props) => {

  const { appMgr } = props;

  const downloadLinkIds = ['reportHTML', 'reportPDF', 'reportLATEX', 'reportWORD'];

  React.useEffect(
    () => {
      appMgr.unbindShiny(downloadLinkIds);
      appMgr.bindShiny();

      return () => appMgr.unbindShiny(downloadLinkIds);
    }
  );

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(6);

  const handleCreateReportBtnClick = e => appMgr.reportMgr.createReport();

  const handleCancelCreateReportBtnClick = () => appMgr.reportMgr.cancelCreatingReport();

  const handleAdjustReportReportingDelayChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportReportingDelay(value);

  const handleAdjustReportSmoothingChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportSmoothing(value);

  const handleAdjustReportCD4ConfIntChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportCD4ConfInt(value);

  const handleRestoreDefaults = e => appMgr.reportMgr.restoreDefaults();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.uiStateMgr.outputsPageEnabled}
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Select report
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{ width: '100%', marginTop: 20, marginBottom: 20 }}>
            <Select
              value={1}
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              <MenuItem value={1} dense>Report on adjusted data</MenuItem>
            </Select>
            <FormHelperText>Select report type</FormHelperText>
          </FormControl>
          <Btn
            onClick={handleCreateReportBtnClick}
            disabled={appMgr.reportMgr.creatingReportInProgress}
          >
            Create report
          </Btn>
          <Button
            onClick={handleCancelCreateReportBtnClick}
            color='primary'
            style={{ marginLeft: 20 }}
            disabled={!appMgr.reportMgr.creatingReportInProgress}
          >
            Cancel
          </Button>
          <ReportsProgressBar progress={appMgr.reportMgr.creatingReportInProgress} />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Report on adjusted data parameters</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.reportMgr.adjustReportParams.reportingDelay}
                    onChange={handleAdjustReportReportingDelayChange}
                    color='primary'
                  />
                }
                label='Adjust count of cases for reporting delay'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.reportMgr.adjustReportParams.smoothing}
                    onChange={handleAdjustReportSmoothingChange}
                    color='primary'
                  />
                }
                label='Apply plot curves smoothing'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appMgr.reportMgr.adjustReportParams.cd4ConfInt}
                    onChange={handleAdjustReportCD4ConfIntChange}
                    color='primary'
                  />
                }
                label='Plot inter-quartile range in CD4 count plots'
              />
            </FormGroup>
            <Button color='primary' onClick={handleRestoreDefaults}>Restore defaults</Button>
          </Paper>
        </Grid>
        {appMgr.reportMgr.report && <React.Fragment>
          <Grid item xs={12}>
            <Divider light style={{ margin: '30px 0' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>
              View and download
          </Typography>
          </Grid>
          <Grid item xs={3}>
            <Link href='#'
              id='reportHTML'
              className='shiny-download-link'
            >
              HTML
            </Link>
            <Link href='#'
              id='reportPDF'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              PDF
            </Link>
            <Link href='#'
              id='reportLATEX'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              Latex
            </Link>
            <Link href='#'
              id='reportWORD'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              MS Word
            </Link>
          </Grid>
          <Grid item xs={9}>
            <Paper style={{ padding: 10 }}>
              <div
                dangerouslySetInnerHTML={{ __html: appMgr.reportMgr.report }}
                style={{ overflowX: 'auto' }}
              />
            </Paper>
          </Grid>
        </React.Fragment>}
      </Grid>
    </TabPanel>
  );
};

export default observer(TabReports);

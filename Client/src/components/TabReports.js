import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import TabPanel from './TabPanel';
import Btn from './Btn';
import ProgressBar from './ProgressBar';

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

  const handleNextpageBtnClick = () => appMgr.uiStateMgr.setActivePageId(6);

  const handleCreateReportBtnClick = () => appMgr.reportMgr.createReport();

  const handleCancelCreateReportBtnClick = () => appMgr.reportMgr.cancelCreatingReport();

  const handleAdjustReportReportingDelayChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportReportingDelay(value);

  const handleAdjustReportSmoothingChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportSmoothing(value);

  const handleAdjustReportCD4ConfIntChange = (e, value) =>
    appMgr.reportMgr.setAdjustReportCD4ConfInt(value);

  const handleRestoreDefaults = () => appMgr.reportMgr.restoreDefaults();

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
        <Grid item xs={2}>
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
          <ProgressBar progress={appMgr.reportMgr.creatingReportInProgress} />
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Parameters for report on adjusted data</Typography>
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
          <Grid item xs={2}>
            <Link
              download
              href='#'
              id='reportHTML'
              className='shiny-download-link'
            >
              HTML
            </Link>
            <Link
              download
              href='#'
              id='reportPDF'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              PDF
            </Link>
            <Link
              download
              href='#'
              id='reportLATEX'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              Latex
            </Link>
            <Link
              download
              href='#'
              id='reportWORD'
              className='shiny-download-link'
              style={{ marginLeft: 10 }}
            >
              MS Word
            </Link>
          </Grid>
          <Grid item xs={10}>
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

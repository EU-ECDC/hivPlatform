import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TabPanel from './TabPanel';

const TabOutputs = (props) => {
  const { appMgr } = props;

  const downloadLinkIds = [
    'downAdjDataCSV', 'downAdjDataRDS', 'downAdjDataDTA',
    'downRepDelDataCSV', 'downRepDelDataRDS', 'downRepDelDataDTA',
    'downMainFitDetailedRDS',
    'downMainFitCSV', 'downMainFitRDS', 'downMainFitDTA',
    'downBootFitDetailedRDS',
    'downBootFitCSV', 'downBootFitRDS', 'downBootFitDTA',
    'downBootStatDetailedRDS',
    'downBootStatCSV', 'downBootStatRDS', 'downBootStatDTA',
    'downFitXLSM', 'downFitXLSX'
  ];

  React.useEffect(
    () => {
      appMgr.unbindShiny(downloadLinkIds);
      appMgr.bindShiny();

      return () => appMgr.unbindShiny(downloadLinkIds);
    }
  );

  let adjustmentsLinks = null;
  if (appMgr.uiStateMgr.adjustmentsOutputsEnabled) {
    adjustmentsLinks =
      <React.Fragment>
        <Link download href='#' id='downAdjDataCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downAdjDataRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downAdjDataDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
  } else {
    adjustmentsLinks =
      <React.Fragment>
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
  }

  let repDelLinks = null;
  if (appMgr.uiStateMgr.repDelOutputsEnabled) {
    repDelLinks =
      <React.Fragment>
        <Link download href='#' id='downRepDelDataCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downRepDelDataRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downRepDelDataDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
  } else {
    repDelLinks =
      <React.Fragment>
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
  }

  let hivModelFitDetailedLinks = null;
  let hivModelFitLinks = null;
  let hivModelExcelLinks = null;
  if (appMgr.uiStateMgr.modellingOutputsEnabled) {
    hivModelFitDetailedLinks =
      <React.Fragment>
        <Link download href='#' id='downMainFitDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelFitLinks =
      <React.Fragment>
        <Link download href='#' id='downMainFitCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downMainFitRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downMainFitDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
    hivModelExcelLinks =
      <React.Fragment>
      <Link download href='#' id='downFitXLSM' className='shiny-download-link'>xlsm (Excel with Macro - automatic refresh)</Link>&nbsp;|<br />
      <Link download href='#' id='downFitXLSX' className='shiny-download-link'>xlsx (Excel without Macro - manual refresh)</Link>
      </React.Fragment>;
  } else {
    hivModelFitDetailedLinks =
      <React.Fragment>
        rds (R)
      </React.Fragment>;
    hivModelFitLinks =
      < React.Fragment >
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
    hivModelExcelLinks =
      < React.Fragment >
        xlsm (Excel with Macro - automatic refresh)&nbsp;|<br />
        xlsx (Excel without Macro - manual refresh)
      </React.Fragment>;
  }

  let hivModelBootDetailedLinks = null;
  let hivModelBootLinks = null;
  let hivModelStatDetailedLinks = null;
  let hivModelStatLinks = null;
  if (appMgr.uiStateMgr.bootstrapOutputsEnabled) {
    hivModelBootDetailedLinks =
      <React.Fragment>
        <Link download href='#' id='downBootFitDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelBootLinks =
      <React.Fragment>
        <Link download href='#' id='downBootFitCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downBootFitRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downBootFitDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
    hivModelStatDetailedLinks =
      <React.Fragment>
        <Link download href='#' id='downBootStatDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelStatLinks =
      <React.Fragment>
        <Link download href='#' id='downBootStatCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downBootStatRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link download href='#' id='downBootStatDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
  } else {
    hivModelBootDetailedLinks =
      <React.Fragment>
        rds (R)
      </React.Fragment>;
    hivModelBootLinks =
      < React.Fragment >
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
    hivModelStatDetailedLinks =
      <React.Fragment>
        rds (R)
      </React.Fragment>;
    hivModelStatLinks =
      < React.Fragment >
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
  }

  return (
    <TabPanel>
      <Grid container spacing={2} style={{ paddingTop: 43 }}>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Outputs
          </Typography>
        </Grid>
        <Grid item xs={2}>
          Adjustments
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width='300px'>Description</TableCell>
                  <TableCell width='320px'>Format</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Adjusted case-based data</TableCell>
                  <TableCell>{adjustmentsLinks}</TableCell>
                  <TableCell>Flat table</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Reporting delays distribution</TableCell>
                  <TableCell>{repDelLinks}</TableCell>
                  <TableCell>Flat table</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          HIV Model
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width='300px'>Description</TableCell>
                  <TableCell width='320px'>Format</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Detailed main fit model results</TableCell>
                  <TableCell>{hivModelFitDetailedLinks}</TableCell>
                  <TableCell>R list object</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs of main fit model</TableCell>
                  <TableCell>{hivModelFitLinks}</TableCell>
                  <TableCell>Flat table</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Detailed bootstrap fits model results</TableCell>
                  <TableCell>{hivModelBootDetailedLinks}</TableCell>
                  <TableCell>R list object</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs of bootstrap fits</TableCell>
                  <TableCell>{hivModelBootLinks}</TableCell>
                  <TableCell>Flat table</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Detailed bootstrap statistics results</TableCell>
                  <TableCell>{hivModelStatDetailedLinks}</TableCell>
                  <TableCell>R list object</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs bootstrap statistics</TableCell>
                  <TableCell>{hivModelStatLinks}</TableCell>
                  <TableCell>Flat table</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs of main fit and bootstrap</TableCell>
                  <TableCell>{hivModelExcelLinks}</TableCell>
                  <TableCell>Excel file with tables and charts</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabOutputs);

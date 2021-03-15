import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TabPanel from './TabPanel';

const TabOutputs = (props) => {
  const { appMgr } = props;

  const downloadLinkIds = [
    'downAdjDataCSV', 'downAdjDataRDS', 'downAdjDataDTA',
    'downMainFitDetailedRDS',
    'downMainFitCSV', 'downMainFitRDS', 'downMainFitDTA',
    'downBootFitDetailedRDS',
    'downBootFitCSV', 'downBootFitRDS', 'downBootFitDTA',
    'downBootStatDetailedRDS',
    'downBootStatCSV', 'downBootStatRDS', 'downBootStatDTA'
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
        <Link href='#' id='downAdjDataCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downAdjDataRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downAdjDataDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
  } else {
    adjustmentsLinks =
      <React.Fragment>
        csv (text)&nbsp;|&nbsp;rds (R)&nbsp;|&nbsp;dta (Stata)
      </React.Fragment>;
  }

  let hivModelFitDetailedLinks = null;
  let hivModelFitLinks = null;
  if (appMgr.uiStateMgr.modellingOutputsEnabled) {
    hivModelFitDetailedLinks =
      <React.Fragment>
        <Link href='#' id='downMainFitDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelFitLinks =
      <React.Fragment>
        <Link href='#' id='downMainFitCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downMainFitRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downMainFitDTA' className='shiny-download-link'>dta (Stata)</Link>
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
  }

  let hivModelBootDetailedLinks = null;
  let hivModelBootLinks = null;
  let hivModelStatDetailedLinks = null;
  let hivModelStatLinks = null;
  if (appMgr.uiStateMgr.bootstrapOutputsEnabled) {
    hivModelBootDetailedLinks =
      <React.Fragment>
        <Link href='#' id='downBootFitDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelBootLinks =
      <React.Fragment>
        <Link href='#' id='downBootFitCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downBootFitRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downBootFitDTA' className='shiny-download-link'>dta (Stata)</Link>
      </React.Fragment>;
    hivModelStatDetailedLinks =
      <React.Fragment>
        <Link href='#' id='downBootStatDetailedRDS' className='shiny-download-link'>rds (R)</Link>
      </React.Fragment>;
    hivModelStatLinks =
      <React.Fragment>
        <Link href='#' id='downBootStatCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downBootStatRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
        <Link href='#' id='downBootStatDTA' className='shiny-download-link'>dta (Stata)</Link>
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
            <Table hover>
              <TableHead>
                <TableRow>
                  <TableCell width='300px'>Description</TableCell>
                  <TableCell width='200px'>Format</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Adjusted case-based data</TableCell>
                  <TableCell>{adjustmentsLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Reporting delays distributions</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
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
                  <TableCell width='200px'>Format</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Detailed main fit model results</TableCell>
                  <TableCell>{hivModelFitDetailedLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs of main fit model</TableCell>
                  <TableCell>{hivModelFitLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Detailed bootstrap fits model results</TableCell>
                  <TableCell>{hivModelBootDetailedLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs of bootstrap fits</TableCell>
                  <TableCell>{hivModelBootLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Detailed bootstrap statistics results</TableCell>
                  <TableCell>{hivModelStatDetailedLinks}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Main outputs bootstrap statistics</TableCell>
                  <TableCell>{hivModelStatLinks}</TableCell>
                  <TableCell></TableCell>
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

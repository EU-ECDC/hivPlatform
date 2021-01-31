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

  const downloadLinkIds = ['downAdjDataCSV', 'downAdjDataRDS', 'downAdjDataDTA'];

  React.useEffect(
    () => {
      appMgr.unbindShiny(downloadLinkIds);
      appMgr.bindShiny();

      return () => appMgr.unbindShiny(downloadLinkIds);
    }
  );

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
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Format</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Adjusted case-based data</TableCell>
                  <TableCell>{new Date().toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href='#' id='downAdjDataCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
                    <Link href='#' id='downAdjDataRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
                    <Link href='#' id='downAdjDataDTA' className='shiny-download-link'>dta (Stata)</Link>
                  </TableCell>
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

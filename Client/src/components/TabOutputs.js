import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import TabPanel from './TabPanel';

const TabOutputs = (props) => {
  const { appMgr } = props;

  const handleClick = () => appMgr.btnClicked('downloadBtn')

  return (
    <TabPanel>
      <Grid container spacing={2} style={{paddingTop: 45}}>
        <Grid item xs={2}>
          <Typography variant='h6'>
            Adjusted data downloads
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width='5%'>Idx</TableCell>
                  <TableCell width='25%'>Type</TableCell>
                  <TableCell width='30%'>Description</TableCell>
                  <TableCell width='20%'>Link</TableCell>
                  <TableCell width='20%'>Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>1.</TableCell>
                  <TableCell>Adjusted data</TableCell>
                  <TableCell>Case-based data after adjustments</TableCell>
                  <TableCell><Link href="#" onClick={handleClick}>rds file</Link></TableCell>
                  <TableCell>2MB</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>2.</TableCell>
                  <TableCell>HIV Modelling tool</TableCell>
                  <TableCell>Test</TableCell>
                  <TableCell><Link href="#">zipped csv files</Link></TableCell>
                  <TableCell>4MB</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        {/* <Grid item xs={3}>
          <Typography variant='body1'>
            HIV Modelling data downloads
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Table>
              <TableBody>
                <TableRow hover>
                  <TableCell width={150}>R</TableCell>
                  <TableCell><Link href="#">rds file</Link></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell width={100}>HIV Modelling tool</TableCell>
                  <TableCell><Link href="#">zipped csv files</Link></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body1'>
            Reporting delays downloads
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}></Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid> */}
      </Grid>
    </TabPanel>
  );
};

export default observer(TabOutputs);

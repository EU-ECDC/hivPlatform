import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import TabPanel from './TabPanel';

const TabOutputs = () => {

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
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
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body1'>
            Adjusted data downloads
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}></Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabOutputs;

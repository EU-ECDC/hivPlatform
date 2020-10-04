import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import DiagnosisRates from '../DiagnosisRates';

const TabModellingInputs = props => {
  const { appManager } = props;

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            Upload model parameters file
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <input style={{ display: 'none' }} id='modelUploadBtn' type='file' />
          <label htmlFor='modelUploadBtn'>
            <Btn><CloudUploadIcon />&nbsp;Upload data</Btn>
          </label>
          <Typography variant='body2' color='textSecondary' style={{ marginTop: 10 }}>
            Parameters loaded from model file override those determined from data.<br />
            Supported files types: xml (uncompressed and zip archives)
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Uploaded files details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Table>
                  <TableBody>
                    <TableRow hover>
                      <TableCell width={100}>File names</TableCell>
                      <TableCell>Model.xml</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Time intervals and diagnosis rates modelling
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <DiagnosisRates />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModellingInputs;

import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TabPanel from './TabPanel';
import Btn from './Btn';

const userStyles = makeStyles({
  header: {
    // textTransform: 'uppercase'
  }
});

const TabUploadCase = (props) => {
  const { appManager } = props;
  const classes = userStyles();

  React.useEffect(
    () => {
      appManager.unbindShinyInputs();
      appManager.bindShinyInputs();

      return () => appManager.unbindShinyInputs();
    }
  );

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <input style={{ display: 'none' }} id='caseUploadBtn' className='uploadBtn' type='file' />
          <Tooltip title='Select case-based data file'>
            <label htmlFor='caseUploadBtn'>
              <Btn><CloudUploadIcon/>&nbsp;Upload data</Btn>
            </label>
          </Tooltip>
          <Skeleton variant="text" width='100%' animation='wave' />
          {
            appManager.fileUploadProgress &&
            <LinearProgress
              variant='determinate'
              value={appManager.fileUploadProgress * 100}
              color='secondary'
            />
          }
          <Typography variant='body2' color='textSecondary'>
            Maximum file size: 70MB<br />
            Supported files types: rds, txt, csv, xls, xlsx (uncompressed and zip archives)
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Uploaded file details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.header}>File name</TableCell><TableCell>{appManager.caseBasedDataFileName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.header}>File size</TableCell><TableCell>{appManager.caseBasedDataFileSize}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.header}>File type</TableCell><TableCell>{appManager.caseBasedDataFileType}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.header} style={{ borderBottom: 'none' }}>File path</TableCell><TableCell style={{ borderBottom: 'none' }}>{appManager.caseBasedDataPath}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow><TableCell className={classes.header}>Column names</TableCell></TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          Attribute mapping
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Attribute mapping</Typography>
            <Grid container spacing={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attribute</TableCell>
                    <TableCell>Column</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Gender</TableCell>
                    <TableCell>
                    <Select style={{width: '100%', padding: '0 16px'}}>
                      <MenuItem value='gender' dense>gender</MenuItem>
                      <MenuItem value='transmission' dense>transmission</MenuItem>
                      <MenuItem value='dateOfDiagnosisYear' dense>dateofdiagnosisyear</MenuItem>
                    </Select>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabUploadCase);

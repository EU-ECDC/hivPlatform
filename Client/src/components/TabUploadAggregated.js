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
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckIcon from '@material-ui/icons/Check';
import TabPanel from './TabPanel';
import Btn from './Btn';
import Skel from './Skeleton';

const userStyles = makeStyles({
  header: {
    // textTransform: 'uppercase'
  }
});

const TabUploadAggregated = (props) => {
  const { appManager } = props;
  const classes = userStyles();

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            Upload aggregated data
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <input style={{ display: 'none' }} id='aggUploadBtn' className='uploadBtn' type='file' />
          <Tooltip title='Select case-based data file'>
            <label htmlFor='caseUploadBtn'>
              <Btn><CloudUploadIcon />&nbsp;Upload data</Btn>
            </label>
          </Tooltip>
          <Skeleton variant='text' width='100%' animation='wave' />
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
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Uploaded files details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Table>
                  <TableBody>
                    <TableRow hover>
                      <TableCell className={classes.header} width={100}>File names</TableCell>
                      <TableCell>{appManager.aggregatedDataFileNames.join(', ')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabUploadAggregated);

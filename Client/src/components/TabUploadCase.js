import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TabPanel from './TabPanel';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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
        <Grid item xs={2}>
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
        </Grid>
        <Grid item xs={5}>
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
                <TableCell className={classes.header}>File path</TableCell><TableCell>{appManager.caseBasedDataPath}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={5}>
          <Table>
            <TableBody>
              <TableRow><TableCell className={classes.header}>Column names</TableCell></TableRow>
              <TableRow><TableCell>...</TableCell></TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabUploadCase);

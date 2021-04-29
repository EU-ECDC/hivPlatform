import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TableChartIcon from '@material-ui/icons/TableChart';
import Button from '@material-ui/core/Button';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import UploadProgressBar from '../UploadProgressBar';
import FormatBytes from '../../utilities/FormatBytes';
import MessageAlert from '../MessageAlert';

const userStyles = makeStyles({
  header: {
    width: 142,
    fontWeight: 'bold'
  },
  content: {
    maxWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
});

const TabUploadAggregated = props => {
  const { appMgr } = props;
  const classes = userStyles();

  const handleUploadBtnClick = e => appMgr.aggrDataMgr.uploadData(e.target);
  const handleNextPageBtnClick = () => appMgr.uiStateMgr.setActivePageId(4);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              disabled={!appMgr.uiStateMgr.modellingPageEnabled}
              onClick={handleNextPageBtnClick}
            >
              Next step
          </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Upload aggregated data
        </Typography>
        </Grid>
        <Grid item xs={2}>
          <input
            style={{ display: 'none' }}
            id='aggrUploadBtn'
            className='uploadBtn'
            type='file'
            onChange={handleUploadBtnClick}
          />
          <Tooltip title='Select aggregated data file'>
            <label htmlFor='aggrUploadBtn'>
              <Btn style={{ marginBottom: 6 }}><CloudUploadIcon />&nbsp;Upload data</Btn>
            </label>
          </Tooltip>
          <Tooltip title='Remove aggregated data from analysis'>
            <Button
              style={{ marginBottom: 6, marginLeft: 20 }}
              color='primary'
              disabled={!appMgr.uiStateMgr.aggrDataUnloadEnabled}
            >
              Unload data
            </Button>
          </Tooltip>
          <Typography variant='body2' color='textSecondary'>
            Maximum file size: 100MB<br />
            Supported files types: csv (zip archives)
          </Typography>
          <UploadProgressBar progress={appMgr.aggrDataMgr.fileUploadProgress} />
          <MessageAlert
            valid={appMgr.aggrDataMgr.actionValid}
            msg={appMgr.aggrDataMgr.actionMessage}
          />
        </Grid>
        <Grid item xs={10}>
          {!appMgr.aggrDataMgr.actionValid &&
            <TableChartIcon style={{ color: '#eee', fontSize: 600 }}/>
          }
          {appMgr.aggrDataMgr.actionValid &&
            <Paper style={{ padding: 10 }}>
              <Typography variant='overline'>Uploaded file details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Table>
                    <TableBody>
                      <TableRow hover>
                        <TableCell className={classes.header}>File name</TableCell><TableCell className={classes.content}>{appMgr.aggrDataMgr.fileName}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className={classes.header}>File path</TableCell><TableCell className={classes.content}>{appMgr.aggrDataMgr.filePath}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className={classes.header}>File size</TableCell><TableCell className={classes.content}>{FormatBytes(appMgr.aggrDataMgr.fileSize)}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className={classes.header}>File type</TableCell><TableCell className={classes.content}>{appMgr.aggrDataMgr.fileType}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={6}>
                  <Table>
                    <TableBody>
                      <TableRow hover><TableCell className={classes.header}>Data names</TableCell></TableRow>
                      <TableRow hover><TableCell style={{ whiteSpace: 'normal' }} className={classes.content}>
                        <div style={{ overflow: 'auto', maxHeight: 164 }}>
                          {appMgr.aggrDataMgr.dataNamesString}
                        </div>
                      </TableCell></TableRow>
                      <TableRow hover><TableCell className={classes.header}>Population names</TableCell></TableRow>
                      <TableRow hover><TableCell style={{ whiteSpace: 'normal' }} className={classes.content}>
                        <div style={{ overflow: 'auto', maxHeight: 164 }}>
                          {appMgr.aggrDataMgr.populationNamesString}
                        </div>
                      </TableCell></TableRow>

                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Paper>
          }
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabUploadAggregated);

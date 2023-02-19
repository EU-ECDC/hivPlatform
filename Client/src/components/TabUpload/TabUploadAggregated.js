import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableChartIcon from '@mui/icons-material/TableChart';
import Button from '@mui/material/Button';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import UploadProgressBar from '../UploadProgressBar';
import FormatBytes from '../../utilities/FormatBytes';
import MessageAlert from '../MessageAlert';

const HeaderCell = (props) => <TableCell sx={{ width: 142, fontWeight: 'bold'}} {...props} />;
const ContentCell = (props) =>
  <TableCell
    sx={{
      maxWidth: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }}
    {...props}
  />;

const TabUploadAggregated = props => {
  const { appMgr } = props;

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
            accept='.csv, .zip'
            onChange={handleUploadBtnClick}
          />
          <Tooltip title='Select aggregated data file' arrow>
            <label htmlFor='aggrUploadBtn'>
              <Btn sx={{ marginBottom: '6px', color: 'white' }}>
                <CloudUploadIcon />&nbsp;Upload data
              </Btn>
            </label>
          </Tooltip>
          {/* <Tooltip title='Remove aggregated data from analysis (UNDER DEVELOPMENT)' arrow>
            <span>
              <Button
                sx={{ marginBottom: '6px', marginLeft: '20px' }}
                color='primary'
                // disabled={!appMgr.uiStateMgr.aggrDataUnloadEnabled}
                disabled={true}
              >
                Unload data
              </Button>
            </span>
          </Tooltip> */}
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
            <TableChartIcon sx={{ color: '#eee', fontSize: '600px' }}/>
          }
          {appMgr.aggrDataMgr.actionValid &&
            <Paper sx={{ padding: '10px' }}>
              <Typography variant='overline'>Uploaded file details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <HeaderCell>File name</HeaderCell>
                        <ContentCell>{appMgr.aggrDataMgr.fileName}</ContentCell>
                      </TableRow>
                      <TableRow>
                        <HeaderCell>File size</HeaderCell>
                        <ContentCell>{FormatBytes(appMgr.aggrDataMgr.fileSize)}</ContentCell>
                      </TableRow>
                      <TableRow>
                        <HeaderCell>File type</HeaderCell>
                        <ContentCell>{appMgr.aggrDataMgr.fileType}</ContentCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={6}>
                  <Table>
                    <TableBody>
                      <TableRow hover={false}><HeaderCell>Data names</HeaderCell></TableRow>
                      <TableRow>
                        <ContentCell sx={{ whiteSpace: 'normal' }}>
                          <div style={{ overflow: 'auto', maxHeight: 164 }}>
                            {appMgr.aggrDataMgr.dataNamesString}
                          </div>
                        </ContentCell>
                      </TableRow>
                      <TableRow hover={false}><HeaderCell>Population names</HeaderCell></TableRow>
                      <TableRow>
                        <ContentCell sx={{ whiteSpace: 'normal' }}>
                          <div style={{ overflow: 'auto', maxHeight: 164 }}>
                            {appMgr.aggrDataMgr.populationNamesString}
                          </div>
                        </ContentCell>
                      </TableRow>
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

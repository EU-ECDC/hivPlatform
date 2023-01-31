import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import PeopleIcon from '@mui/icons-material/People';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Btn from '../Btn';
import UploadProgressBar from '../UploadProgressBar';
import MessageAlert from '../MessageAlert';
import FormatBytes from '../../utilities/FormatBytes';

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

const CaseUpload = (props) => {
  const { appMgr } = props;

  const handleUploadBtnClick = e => appMgr.caseBasedDataMgr.uploadData(e.target);
  const handleNextPageBtnClick = () => appMgr.uiStateMgr.setActivePageId(2);
  const handleUnloadCaseBasedDataClick = () => appMgr.caseBasedDataMgr.unloadData();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display='flex' justifyContent='flex-end'>
          <Button
            size='small'
            color='primary'
            disabled={!appMgr.uiStateMgr.summaryPageEnabled}
            onClick={handleNextPageBtnClick}
          >
            Next step
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>
          Upload case-based data
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <input
          style={{ display: 'none' }}
          id='caseUploadBtn'
          className='uploadBtn'
          type='file'
          onChange={handleUploadBtnClick}
        />
        <Tooltip title='Select case-based data file' arrow>
          <label htmlFor='caseUploadBtn'>
            <Btn sx={{ marginBottom: '6px', color: 'white' }} ><CloudUploadIcon />&nbsp;Upload data</Btn>
          </label>
        </Tooltip>
        <Tooltip title='Remove case-based data from analysis (UNDER DEVELOPMENT)' arrow>
          <span>
            <Button
              sx={{ marginBottom: '6px', marginLeft: '20px' }}
              color='primary'
              // disabled={!appMgr.uiStateMgr.caseBasedDataUnloadEnabled}
              disabled={true}
              onClick={handleUnloadCaseBasedDataClick}
            >
              Unload data
            </Button>
          </span>
        </Tooltip>
        <Typography variant='body2' color='textSecondary'>
          Maximum file size: 100MB<br />
          Supported files types: rds, txt, csv, xls, xlsx (uncompressed and zip archives)
        </Typography>
        <UploadProgressBar progress={appMgr.caseBasedDataMgr.uploadProgress} />
        <MessageAlert
          valid={appMgr.caseBasedDataMgr.actionValid}
          msg={appMgr.caseBasedDataMgr.actionMessage}
        />
      </Grid>
      <Grid item xs={10}>
        {!appMgr.caseBasedDataMgr.actionValid &&
          <PeopleIcon sx={{ color: '#eee', fontSize: '600px' }}/>
        }
        {appMgr.caseBasedDataMgr.actionValid &&
          <Paper sx={{ padding: '10px' }}>
            <Typography variant='overline'>Uploaded file details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <HeaderCell>File name</HeaderCell>
                      <ContentCell>{appMgr.caseBasedDataMgr.fileName}</ContentCell>
                    </TableRow>
                    <TableRow>
                      <HeaderCell>File size</HeaderCell>
                      <ContentCell>{FormatBytes(appMgr.caseBasedDataMgr.fileSize)}</ContentCell>
                    </TableRow>
                    <TableRow>
                      <HeaderCell>File type</HeaderCell>
                      <ContentCell>{appMgr.caseBasedDataMgr.fileType}</ContentCell>
                    </TableRow>
                    <TableRow>
                      <HeaderCell>Number of records</HeaderCell>
                      <ContentCell>{appMgr.caseBasedDataMgr.recordCount}</ContentCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow hover={false}><HeaderCell>Column names</HeaderCell></TableRow>
                    <TableRow>
                      <ContentCell sx={{ whiteSpace: 'normal' }}>
                        <div style={{ overflow: 'auto', maxHeight: '164px'}}>
                          {appMgr.caseBasedDataMgr.columnNamesString}
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
  );
};

export default observer(CaseUpload);

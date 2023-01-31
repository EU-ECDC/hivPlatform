import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TabPanel from '../TabPanel';
import Btn from '../Btn';
import DiagnosisRates from './DiagnosisRates';
import DiagnosisRatesSelect from './DiagnosisRatesSelect';

const TabModellingInputs = props => {
  const { appMgr } = props;

  const handleModelUploadChange = e => {
    const file = e.target.files[0];
    appMgr.modelMgr.setModelsParamFile(file);
    e.target.value = null;
  };

  const handleModelSaveClick = e => appMgr.modelMgr.saveModelsParamFile();

  const handleNextpageBtnClick = () => appMgr.uiStateMgr.setActivePageId(4, 2);

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Load model parameters file
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <input
            style={{ display: 'none' }}
            id='modelUploadBtn'
            type='file'
            onChange={handleModelUploadChange}
          />
          <Tooltip title='Select XML model file' arrow>
            <label htmlFor='modelUploadBtn'>
              <Btn><CloudUploadIcon />&nbsp;Load model</Btn>
            </label>
          </Tooltip>
          <Tooltip title='Save XML model file (UNDER DEVELOPMENT)' arrow>
            <span>
              <Button
                sx={{ marginBottom: '6px', marginLeft: '20px' }}
                color='primary'
                // disabled={true}
                onClick={handleModelSaveClick}
              >
                Save model
              </Button>
            </span>
          </Tooltip>
          <Typography variant='body2' color='textSecondary' style={{ marginTop: 10 }}>
            Parameters loaded from model file override those determined from data.<br />
            Supported files types: xml (uncompressed and zip archives)
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Uploaded file details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell width={100}>File name</TableCell>
                      <TableCell>{appMgr.modelMgr.modelsParamFileName}</TableCell>
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
        <Grid item xs={12}>
          <Typography variant='h6'>
            Time intervals and diagnosis rates modelling
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <DiagnosisRatesSelect timeIntCollMgr={appMgr.modelMgr.timeIntCollMgr} />
        </Grid>
        <Grid item xs={10}>
          <DiagnosisRates timeIntCollMgr={appMgr.modelMgr.timeIntCollMgr} />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingInputs);

import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TabPanel from './TabPanel';
import OriginGroupings from './OriginGroupings';
import Btn from './Btn';
import FormatBytes from '../utilities/FormatBytes'

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

const UploadProgressBar = (props) => {
  const { progress } = props;
  if (progress === null) return null;
  return <LinearProgress variant='determinate' value={progress * 100} color='secondary'/>
};

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

  let attrMappingSelectOptions = [];
  if (appManager.caseBasedDataColumnNames !== null) {
    attrMappingSelectOptions = appManager.caseBasedDataColumnNames.map(colName => (
      <MenuItem key={colName} value={colName} dense>{colName}</MenuItem>
    ));
  }

  const attrMappingTableRows = appManager.caseBasedDataAttributeMappingArray.map(entry => (
    <TableRow hover key={entry.Key}>
      <TableCell>{entry.Key}</TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        <Select style={{ width: '100%', fontSize: '0.75rem' }} defaultValue={entry.Val} disableUnderline>
          <MenuItem value='' dense>&nbsp;</MenuItem>
          {attrMappingSelectOptions}
        </Select>
      </TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        <Input style={{ width: '100%', fontSize: '0.75rem' }}></Input>
      </TableCell>
    </TableRow>
  ));


  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color='textSecondary'>
            Upload case-based data
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <input style={{ display: 'none' }} id='caseUploadBtn' className='uploadBtn' type='file' />
          <Tooltip title='Select case-based data file'>
            <label htmlFor='caseUploadBtn'>
              <Btn style={{ marginBottom: 6 }}><CloudUploadIcon/>&nbsp;Upload data</Btn>
            </label>
          </Tooltip>
          <Typography variant='body2' color='textSecondary'>
            Maximum file size: 70MB<br />
            Supported files types: rds, txt, csv, xls, xlsx (uncompressed and zip archives)
          </Typography>
          <UploadProgressBar progress={appManager.fileUploadProgress} />
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Uploaded file details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow hover>
                      <TableCell className={classes.header}>File name</TableCell><TableCell className={classes.content}>{appManager.caseBasedDataFileName}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className={classes.header}>File path</TableCell><TableCell className={classes.content}>{appManager.caseBasedDataPath}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className={classes.header}>File size</TableCell><TableCell className={classes.content}>{FormatBytes(appManager.caseBasedDataFileSize)}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className={classes.header}>File type</TableCell><TableCell className={classes.content}>{appManager.caseBasedDataFileType}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell className={classes.header}>Number of records</TableCell><TableCell className={classes.content}>{appManager.caseBasedDataRowCount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={6}>
                <Table>
                  <TableBody>
                    <TableRow hover><TableCell className={classes.header}>Column names</TableCell></TableRow>
                    <TableRow hover><TableCell style={{ whiteSpace: 'normal' }} className={classes.content}>
                      <div style={{overflow: 'auto', maxHeight: 164}}>
                        {appManager.caseBasedDataColumnNamesString}
                      </div>
                    </TableCell></TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Divider light style={{ margin: '30px 0' }} />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Btn style={{marginBottom: 6}}><AssignmentIcon />&nbsp;Apply mapping</Btn>
          <Typography variant='body2' color='textSecondary'>
            Input data set to be mapped to internal attributes.<br />
            Adjust mapping and press 'Apply mapping' button.
          </Typography>
          {/*
          <Typography variant='body2'>
            <CheckIcon style={{ width: '0.75rem', height: '0.75rem'}}/>&nbsp;Applied mapping is valid.
          </Typography>
          */}
        </Grid>
        <Grid item xs={9}>
          <Paper style={{padding: 10}}>
            <Typography variant='overline'>Attribute mapping</Typography>
            <Grid container spacing={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width='30%'>Attribute</TableCell>
                    <TableCell width='40%'>Uploaded data column</TableCell>
                    <TableCell width='30%'>Override value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attrMappingTableRows}
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Divider light style={{ margin: '30px 0' }} />
      <OriginGroupings appManager={appManager}/>
      <Divider light style={{ margin: '30px 0' }} />
    </TabPanel>
  );
};

export default observer(TabUploadCase);

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
import TabPanel from './TabPanel';
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

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%'}}>
        {numSelected} selected
      </Typography>

      <Button color='primary' disabled>Delete</Button>
      <Button color='primary'>Add</Button>
    </Toolbar>
  );
};

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

  const attrMappingTableRows = appManager.CaseBasedDataAttributeMappingArray.map(entry => (
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
                        {appManager.CaseBasedDataColumnNamesString}
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
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="button">
            Migrant variable regrouping
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Distribution of region of origin (all regions in dataset in descending frequency of occurrence)
          </Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>FullRegionOfOrigin</TableCell><TableCell align='right'>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell>REPCOUNTRY</TableCell><TableCell align='right'>1562</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>SUBAFR</TableCell><TableCell align='right'>2237</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>WESTEUR</TableCell><TableCell align='right'>1119</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>SOUTHASIA</TableCell><TableCell align='right'>164</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>CENTEUR</TableCell><TableCell align='right'>144</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>CAR</TableCell><TableCell align='right'>123</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>LATAM</TableCell><TableCell align='right'>107</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>EASTEUR</TableCell><TableCell align='right'>58</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>NORTHAM</TableCell><TableCell align='right'>49</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>NORTHAMFRMIDEAST</TableCell><TableCell align='right'>43</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>EASTASIAPAC</TableCell><TableCell align='right'>36</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>AUSTNZ</TableCell><TableCell align='right'>33</TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell>UNK</TableCell><TableCell align='right'>1944</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Grouping options</Typography>
            <FormControl style={{ width: '100%', fontSize: '0.75rem' }}>
              <InputLabel>
                Preset
              </InputLabel>
              <Select defaultValue='4'>
                <MenuItem value='1' dense>REPCOUNTRY + UNK + OTHER</MenuItem>
                <MenuItem value='2' dense>REPCOUNTRY + UNK + SUBAFR + OTHER</MenuItem>
                <MenuItem value='3' dense>REPCOUNTRY + UNK + 3 most prevalent regions + OTHER</MenuItem>
                <MenuItem value='4' dense>Custom</MenuItem>
              </Select>
              <FormHelperText>Select regrouping preset</FormHelperText>
            </FormControl>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      inputProps={{ 'aria-label': 'select all desserts' }}
                      color='primary'
                    />
                  </TableCell>
                  <TableCell padding='none'>GroupedRegionOfOrigin</TableCell>
                  <TableCell width='60%'>FullRegionOfOrigin</TableCell>
                  <TableCell align='right' width='10%'>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role='checkbox'>
                  <TableCell padding='checkbox'>
                    <Checkbox inputProps={{ 'aria-labelledby': 'labelId1' }} color='primary'/>
                  </TableCell>
                  <TableCell id='labelId1' scope='row' padding='none'>
                    <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Group 1' />
                  </TableCell>
                  <TableCell style={{ padding: '4px 16px 0px 16px', maxWidth: 300 }}>
                    <Select
                      multiple
                      renderValue={(selected) => (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              style={{ margin: 2 }}
                            />
                          ))}
                        </div>
                      )}
                      value={['REPCOUNTRY', 'SUBAFR', 'NORTHAMFRMIDEAST', 'AUSTNZ', 'SOUTHASIA', 'CENTEUR']}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      disableUnderline
                    >
                      <MenuItem value='REPCOUNTRY' dense>REPCOUNTRY</MenuItem>
                      <MenuItem value='SUBAFR' dense>SUBAFR</MenuItem>
                      <MenuItem value='WESTEUR' dense>WESTEUR</MenuItem>
                      <MenuItem value='SOUTHASIA' dense>SOUTHASIA</MenuItem>
                      <MenuItem value='CENTEUR' dense>CENTEUR</MenuItem>
                      <MenuItem value='CAR' dense>CAR</MenuItem>
                      <MenuItem value='LATAM' dense>LATAM</MenuItem>
                      <MenuItem value='EASTEUR' dense>EASTEUR</MenuItem>
                      <MenuItem value='NORTHAM' dense>NORTHAM</MenuItem>
                      <MenuItem value='NORTHAMFRMIDEAST' dense>NORTHAMFRMIDEAST</MenuItem>
                      <MenuItem value='EASTASIAPAC' dense>EASTASIAPAC</MenuItem>
                      <MenuItem value='AUSTNZ' dense>AUSTNZ</MenuItem>
                      <MenuItem value='UNK' dense>UNK</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align='right'>1562</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding='checkbox'>
                    <Checkbox inputProps={{ 'aria-labelledby': 'labelId2' }} color='primary'/>
                  </TableCell>
                  <TableCell id='labelId2' scope='row' padding='none'>
                    <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Group 2' />
                  </TableCell>
                  <TableCell style={{ padding: '4px 16px 0px 16px', maxWidth: 300 }}>
                    <Select
                      multiple
                      renderValue={(selected) => (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              style={{ margin: 2 }}
                            />
                          ))}
                        </div>
                      )}
                      value={['CAR', 'LATAM']}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      disableUnderline
                    >
                      <MenuItem value='REPCOUNTRY' dense>REPCOUNTRY</MenuItem>
                      <MenuItem value='SUBAFR' dense>SUBAFR</MenuItem>
                      <MenuItem value='WESTEUR' dense>WESTEUR</MenuItem>
                      <MenuItem value='SOUTHASIA' dense>SOUTHASIA</MenuItem>
                      <MenuItem value='CENTEUR' dense>CENTEUR</MenuItem>
                      <MenuItem value='CAR' dense>CAR</MenuItem>
                      <MenuItem value='LATAM' dense>LATAM</MenuItem>
                      <MenuItem value='EASTEUR' dense>EASTEUR</MenuItem>
                      <MenuItem value='NORTHAM' dense>NORTHAM</MenuItem>
                      <MenuItem value='NORTHAMFRMIDEAST' dense>NORTHAMFRMIDEAST</MenuItem>
                      <MenuItem value='EASTASIAPAC' dense>EASTASIAPAC</MenuItem>
                      <MenuItem value='AUSTNZ' dense>AUSTNZ</MenuItem>
                      <MenuItem value='UNK' dense>UNK</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align='right'>2237</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <EnhancedTableToolbar numSelected={0} />
          </Paper>
        </Grid>
      </Grid>
      <Divider light style={{ margin: '30px 0' }} />
    </TabPanel>
  );
};

export default observer(TabUploadCase);

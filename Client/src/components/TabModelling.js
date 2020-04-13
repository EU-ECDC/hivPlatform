import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TabPanel from './TabPanel';
import Btn from './Btn';
import TableToolbar from './TableToolbar';

const TabModelling = props => {
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
          <Typography variant='body2' color='textSecondary' style={{marginTop: 10}}>
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
            Create populations
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                    />
                  </TableCell>
                  <TableCell padding='none'>Stratification name</TableCell>
                  <TableCell width='30%'>Selected variables</TableCell>
                  <TableCell width='40%'>Defined populations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role='checkbox'>
                  <TableCell padding='checkbox'>
                    <Checkbox inputProps={{ 'aria-labelledby': 'labelId1' }} color='primary' />
                  </TableCell>
                  <TableCell id='labelId1' scope='row' padding='none'>
                    <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Gender only' />
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
                      value={['Gender']}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      disableUnderline
                    >
                      <MenuItem value='Gender' dense>Gender</MenuItem>
                      <MenuItem value='Transmission' dense>Transmission</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>F, M</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding='checkbox'>
                    <Checkbox inputProps={{ 'aria-labelledby': 'labelId2' }} color='primary' />
                  </TableCell>
                  <TableCell id='labelId2' scope='row' padding='none'>
                    <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Transmission only' />
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
                      value={['Transmission']}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      disableUnderline
                    >
                      <MenuItem value='Gender' dense>Gender</MenuItem>
                      <MenuItem value='Transmission' dense>Transmission</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>IDU, MSM</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding='checkbox'>
                    <Checkbox inputProps={{ 'aria-labelledby': 'labelId2' }} color='primary' />
                  </TableCell>
                  <TableCell id='labelId2' scope='row' padding='none'>
                    <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Gender and Transmission' />
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
                      value={['Gender', 'Transmission']}
                      style={{ width: '100%', fontSize: '0.75rem' }}
                      disableUnderline
                    >
                      <MenuItem value='Gender' dense>Gender</MenuItem>
                      <MenuItem value='Transmission' dense>Transmission</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>F_IDU, F_MSM, M_IDU, M_MSM</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <TableToolbar numSelected={0} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Create populations
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Paper>asd</Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabModelling;

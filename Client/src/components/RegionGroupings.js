import React from 'react';
import { observer } from 'mobx-react';
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
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%' }}>
        {numSelected} selected
      </Typography>

      <Button color='primary' disabled>Delete</Button>
      <Button color='primary'>Add</Button>
    </Toolbar>
  );
};

const RegionGroupings = (props) => {
  const { appManager } = props;

  const originDistr = appManager.originDistributionArray;
  const originGrouping = appManager.originGrouping;

  const handleGroupingPresetChange = e => {
    appManager.inputValueSet('groupingPresetSelect', e.target.value);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography variant='button'>
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
            {
              originDistr.map(el => (
                <TableRow hover>
                  <TableCell>{el.FullRegionOfOrigin}</TableCell><TableCell align='right'>{el.Count}</TableCell>
                </TableRow>
              ))
            }
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
            <Select defaultValue='REPCOUNTRY + UNK + OTHER' onChange={handleGroupingPresetChange}>
              <MenuItem value='REPCOUNTRY + UNK + OTHER' dense>REPCOUNTRY + UNK + OTHER</MenuItem>
              <MenuItem value='REPCOUNTRY + UNK + SUBAFR + OTHER' dense>REPCOUNTRY + UNK + SUBAFR + OTHER</MenuItem>
              <MenuItem value='REPCOUNTRY + UNK + 3 most prevalent regions + OTHER' dense>REPCOUNTRY + UNK + 3 most prevalent regions + OTHER</MenuItem>
              <MenuItem value='Custom' dense>Custom</MenuItem>
            </Select>
            <FormHelperText>Select regrouping preset</FormHelperText>
          </FormControl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    inputProps={{ 'aria-label': 'select all desserts' }}
                    color='primary' />
                </TableCell>
                <TableCell padding='none'>GroupedRegionOfOrigin</TableCell>
                <TableCell width='60%'>FullRegionOfOrigin</TableCell>
                <TableCell align='right' width='10%'>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                originGrouping.map((el, i) => (
                  <TableRow hover role='checkbox'>
                    <TableCell padding='checkbox'>
                      <Checkbox inputProps={{ 'aria-labelledby': `labelId${i}` }} color='primary' />
                    </TableCell>
                    <TableCell id={`labelId${i}`} scope='row' padding='none'>
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
                                style={{ margin: 2 }} />
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
                ))
              }

              <TableRow hover role='checkbox'>
                <TableCell padding='checkbox'>
                  <Checkbox inputProps={{ 'aria-labelledby': 'labelId10' }} color='primary' />
                </TableCell>
                <TableCell id='labelId10' scope='row' padding='none'>
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
                            style={{ margin: 2 }} />
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
                  <Checkbox inputProps={{ 'aria-labelledby': 'labelId11' }} color='primary' />
                </TableCell>
                <TableCell id='labelId11' scope='row' padding='none'>
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
                            style={{ margin: 2 }} />
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
  )
};

export default observer(RegionGroupings);

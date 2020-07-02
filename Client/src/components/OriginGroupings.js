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

const OriginGroupings = (props) => {
  const { appManager } = props;

  const originDistribution = appManager.originDistributionArray;
  const originGrouping = appManager.originGroupingArray;
  const fullRegionsOfOriginArray = appManager.fullRegionsOfOriginArray;
  console.log(originDistribution);
  console.log(originGrouping);
  console.log(fullRegionsOfOriginArray);

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
              originDistribution.map(el => (
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
                      <Input style={{ width: '100%', fontSize: '0.75rem' }} value={el.GroupedRegionOfOrigin} />
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
                        value={el.FullRegionsOfOrigin}
                        style={{ width: '100%', fontSize: '0.75rem' }}
                        disableUnderline
                      >
                        {
                          fullRegionsOfOriginArray.map(el => (
                            <MenuItem value={el} dense>{el}</MenuItem>
                          ))
                        }
                      </Select>
                    </TableCell>
                    <TableCell align='right'>{el.GroupedRegionOfOriginCount}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <EnhancedTableToolbar numSelected={0} />
        </Paper>
      </Grid>
    </Grid>
  )
};

export default observer(OriginGroupings);

import React from 'react';
import Paper from '@material-ui/core/Paper';
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
import EnhancedTableToolbar from '../EnhancedTableToolbar';

const PopulationCombinations = () => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
            />
          </TableCell>
          <TableCell width='30%' padding='none'>Combination name</TableCell>
          <TableCell>Selected populations</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId1' }} color='primary' />
          </TableCell>
          <TableCell id='labelId1' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='All' />
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
              value={['F', 'M']}
              style={{ width: '100%', fontSize: '0.75rem' }}
              disableUnderline
            >
              <MenuItem value='F' dense>F</MenuItem>
              <MenuItem value='M' dense>M</MenuItem>
              <MenuItem value='IDU' dense>IDU</MenuItem>
              <MenuItem value='MSM' dense>MSM</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId1' }} color='primary' />
          </TableCell>
          <TableCell id='labelId1' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='Male only' />
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
              value={['M']}
              style={{ width: '100%', fontSize: '0.75rem' }}
              disableUnderline
            >
              <MenuItem value='F' dense>F</MenuItem>
              <MenuItem value='M' dense>M</MenuItem>
              <MenuItem value='IDU' dense>IDU</MenuItem>
              <MenuItem value='MSM' dense>MSM</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <EnhancedTableToolbar selectedCount={0} />
  </Paper>
);

export default PopulationCombinations;

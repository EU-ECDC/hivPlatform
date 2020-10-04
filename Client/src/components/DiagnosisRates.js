import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EnhancedTableToolbar from './EnhancedTableToolbar';

const DiagnosisRates = () => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
            />
          </TableCell>
          <TableCell padding='none' width='15%' >Start year</TableCell>
          <TableCell width='15%' >End year</TableCell>
          <TableCell>Jump</TableCell>
          <TableCell>Change by CD4 count</TableCell>
          <TableCell>Change in interval</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId1' }} color='primary' />
          </TableCell>
          <TableCell id='labelId1' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='1980' type='number' />
          </TableCell>
          <TableCell>1984</TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
        </TableRow>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId2' }} color='primary' />
          </TableCell>
          <TableCell id='labelId2' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='1984' type='number' />
          </TableCell>
          <TableCell>1991</TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' checked={true} /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
        </TableRow>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId3' }} color='primary' />
          </TableCell>
          <TableCell id='labelId3' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='1991' type='number' />
          </TableCell>
          <TableCell>1999</TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' checked={true} /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
        </TableRow>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId4' }} color='primary' />
          </TableCell>
          <TableCell id='labelId4' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='1999' type='number' />
          </TableCell>
          <TableCell>2007</TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' checked /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
        </TableRow>
        <TableRow hover role='checkbox'>
          <TableCell padding='checkbox'>
            <Checkbox inputProps={{ 'aria-labelledby': 'labelId5' }} color='primary' />
          </TableCell>
          <TableCell id='labelId5' scope='row' padding='none'>
            <Input style={{ width: '100%', fontSize: '0.75rem' }} value='2007' type='number' />
          </TableCell>
          <TableCell>2015</TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' checked={true} /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
          <TableCell padding='checkbox'><Checkbox color='primary' /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <EnhancedTableToolbar selectedCount={0} />
  </Paper>
);

export default DiagnosisRates;

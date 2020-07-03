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
import TableToolbar from './TableToolbar';

const CreatePopulations = () => (
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
);

export default CreatePopulations;

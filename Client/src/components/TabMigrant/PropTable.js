import React from 'react';
import { observer } from 'mobx-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Title from '../Title';
import IsNull from '../../utilities/IsNull';
import InArray from '../../utilities/InArray';
import StyledTableCell from '../StyledTableCell';

const PropTable = ({ migrMgr }) => {

  const propTable = migrMgr.confBounds;

  const handleStratChange = (stratName) => (e, value) => migrMgr.updatePropTableStratFlag(stratName, value);

  const stratCheckBoxes =
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={migrMgr.propTableStrat.Gender}
            onChange={handleStratChange('Gender')}
            name='check'
            color='primary'
          />
        }
        label='Gender'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={migrMgr.propTableStrat.Transmission}
            onChange={handleStratChange('Transmission')}
            name='check'
            color='primary'
          />
        }
        label='Transmission'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={migrMgr.propTableStrat.Age}
            onChange={handleStratChange('Age')}
            name='check'
            color='primary'
          />
        }
        label='Age'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={migrMgr.propTableStrat.GroupedRegionOfOrigin}
            onChange={handleStratChange('GroupedRegionOfOrigin')}
            name='check'
            color='primary'
          />
        }
        label='Migration'
      />
    </FormGroup>

  let tableEl = null;
  if (IsNull(propTable)) {
    tableEl = <div>No table data available</div>
  } else {
    tableEl =
      <Table size='small'>
        <TableHead>
          <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
            {
              propTable.colNames.map((el, i) => (<TableCell key={i} align='right'>{el}</TableCell>))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            propTable.data.map((el, i) =>
              <TableRow key={i}>
                {
                  el.map((el2, j) => <StyledTableCell key={j} value={el2} isPerc={InArray(propTable.colNames[j], ['Est', 'LB', 'UB'])}/>)
                }
              </TableRow>
            )
          }
        </TableBody>
      </Table>
  }

  return (
    <React.Fragment>
      <Title>Table 3. Proportion of migrants infected post arrival</Title>
      {stratCheckBoxes}
      {tableEl}
    </React.Fragment>
  )
};

export default observer(PropTable);

import React from 'react';
import { observer } from 'mobx-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IsNull from '../../utilities/IsNull';
import IsArray from '../../utilities/IsArray';
import Title from '../Title';
import StyledTableCell from '../StyledTableCell';

const MissStat = (props) => {
  const { missingness } = props;

  let tableEl = null;
  if (IsNull(missingness) || (IsArray(missingness) && missingness.length === 0)) {
    tableEl = <div>No table data available</div>
  } else {
    tableEl =
      <Table size='small'>
        <TableHead>
          <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
            <TableCell align='left' width='700px'>Missing variable</TableCell>
            <TableCell align='right'>Number of excluded cases</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            missingness.map((el, i) => (
              <TableRow key={i}>
                <StyledTableCell value={el.Excluded} isTotal={el.IsTotalRow} align='left' />
                <StyledTableCell value={el.Count} isTotal={el.IsTotalRow} align='right' />
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
  }

  return (
    <React.Fragment>
      <Title>Table 1. Number of cases excluded</Title>
      {tableEl}
    </React.Fragment>
  )
};

export default observer(MissStat);

import React from 'react';
import { observer } from 'mobx-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IsNull from '../../utilities/IsNull';

const SmallTable = props => {
  const { tableData, maxHeight } = props;

  if (IsNull(tableData)) {
    return null;
  }

  return (
    <TableContainer style={{ maxHeight: maxHeight || 300 }}>
      <Table
        size='small'
        stickyHeader
        sx={{
          '& > .MuiTableHead-root': {
            '& > .MuiTableRow-root': {
              '& > .MuiTableCell-root': {
                padding: '5px',
                fontSize: '0.6rem',
                backgroundColor: 'white',
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }
            }
          },
          '& > .MuiTableBody-root': {
            '& > .MuiTableRow-root': {
              '& > .MuiTableCell-root': {
                padding: '5px',
                fontSize: '0.6rem',
                backgroundColor: 'transparent',
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }
            }
          }

        }}
      >
        <TableHead>
          <TableRow>
            {
              tableData.colNames.map((el, i) => (
                <TableCell key={i}>{el}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            tableData.values.map((el, i) => (
              <TableRow hover key={i}>
                {
                  tableData.colNames.map((colName, j) => (
                    <TableCell key={j}>{tableData.values[i][j]}</TableCell>
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default observer(SmallTable);

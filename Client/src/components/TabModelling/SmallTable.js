import React from 'react';
import { observer } from 'mobx-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const SmallTable = props => {
  const { tableData, maxHeight } = props;

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
                textAlign: 'right'
              }
            }
          },
          '& > .MuiTableBody-root': {
            '& > .MuiTableRow-root': {
              '& > .MuiTableCell-root': {
                padding: '5px',
                fontSize: '0.6rem',
                backgroundColor: 'transparent',
                textAlign: 'right'
              }
            }
          }

        }}
      >
        <TableHead>
          <TableRow>
            {
              tableData.ColNames.map((el, i) => (
                <TableCell key={i}>{el}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            tableData.Data[0].map((el, i) => (
              <TableRow hover key={i}>
                {
                  tableData.ColNames.map((colName, j) => (
                    <TableCell key={j}>{tableData.Data[j][i]}</TableCell>
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

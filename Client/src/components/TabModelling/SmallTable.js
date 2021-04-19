import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(() => ({
  table: {
    '& > .MuiTableHead-root': {
      '& > .MuiTableRow-root': {
        '& > .MuiTableCell-root': {
          padding: 5,
          fontSize: '0.6rem',
          backgroundColor: 'white',
          textAlign: 'right'
        }
      }
    },
    '& > .MuiTableBody-root': {
      '& > .MuiTableRow-root': {
        '& > .MuiTableCell-root': {
          padding: 5,
          fontSize: '0.6rem',
          backgroundColor: 'transparent',
          textAlign: 'right'
        }
      }
    }

  },
}));

const SmallTable = props => {
  const { tableData, maxHeight } = props;

  const classes = useStyles();
  return (
    <TableContainer style={{ maxHeight: maxHeight || 300 }}>
      <Table size='small' stickyHeader className={classes.table}>
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

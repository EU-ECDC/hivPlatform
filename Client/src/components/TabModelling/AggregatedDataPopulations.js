import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const AggregatedDataPopulations = (props) => {
  const { appManager } = props;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='30%'>Data type</TableCell>
            <TableCell width='35%'>Use</TableCell>
            <TableCell width='35%'>Years</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>AIDS</TableCell>
            <TableCell>Yes</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
};

export default observer(AggregatedDataPopulations);

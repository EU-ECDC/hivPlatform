import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import AggregatedDataPopulationsRow from './AggregatedDataPopulationsRow';

const AggregatedDataPopulations = (props) => {
  const { appMgr } = props;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='20%'>Data type</TableCell>
            <TableCell width='20%'>Use</TableCell>
            <TableCell width='60%'>Years</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            appMgr.aggrDataMgr.dataFiles.map((dataFile, i) => (
              <AggregatedDataPopulationsRow
                key={i}
                i={i}
                rowCount={1}
                dataFile={dataFile}
                appMgr={appMgr}
              />
            ))
          }
        </TableBody>
      </Table>
    </Paper>
  )
};

export default observer(AggregatedDataPopulations);

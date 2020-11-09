import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AggregatedDataPopulationsRow from './AggregatedDataPopulationsRow';

const AggregatedDataPopulations = (props) => {
  const { appManager } = props;

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
            appManager.aggrDataMgr.dataFilesDead.map((dataFile, i) => (
              <AggregatedDataPopulationsRow
                key={i}
                dataFile={dataFile}
                appManager={appManager}
              />
            ))
          }
          {
            appManager.aggrDataMgr.dataFilesNonDead.map((dataFile, i) => (
              <AggregatedDataPopulationsRow
                key={i}
                dataFile={dataFile}
                appManager={appManager}
              />
            ))
          }
        </TableBody>
      </Table>
    </Paper>
  )
};

export default observer(AggregatedDataPopulations);

import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CreatePopulationRow from './CreatePopulationRow';
import EnhancedTableToolbar from '../EnhancedTableToolbar';

const CreatePopulations = (props) => {
  const { appMgr } = props;
  const [selected, setSelected] = React.useState([]);

  const populations = appMgr.popMgr.populationsJS;

  const handleSelectAllClick = e => {
    if (e.target.checked) {
      const newSelectedIds = populations.map((el, i) => i);
      setSelected(newSelectedIds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = i => e => {
    const selectedIndex = selected.indexOf(i);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, i);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleAddClick = () => {
    appMgr.popMgr.addEmptyPopulation();
  };

  const handleDeleteClick = () => {
    appMgr.popMgr.removePopulations(selected);
    setSelected([]);
  }

  const rowCount = populations.length;
  const selectedCount = selected.length;
  const isSelected = i => selected.indexOf(i) !== -1;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                inputProps={{ 'aria-label': 'select all' }}
                color='primary'
                onClick={handleSelectAllClick}
                checked={rowCount > 0 && selectedCount === rowCount}
              />
            </TableCell>
            <TableCell width='30%' padding='none'>Stratification name</TableCell>
            <TableCell width='30%'>Selected variables</TableCell>
            <TableCell width='40%'>Defined populations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            populations.map((el, i) => (
              <CreatePopulationRow
                key={i}
                i={i}
                population={el}
                appManager={appMgr}
                isSelected={isSelected(i)}
                onSelectClick={handleSelectClick(i)}
              />
            ))
          }
        </TableBody>
      </Table>
      <EnhancedTableToolbar
        selectedCount={selectedCount}
        onAddClick={handleAddClick}
        onDeleteClick={handleDeleteClick}
      />
    </Paper>
  )
};

export default observer(CreatePopulations);

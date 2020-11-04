import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CombinePopulationsRow from './CombinePopulationsRow';
import EnhancedTableToolbar from '../EnhancedTableToolbar';

const CombinePopulations = (props) => {
  const { appManager } = props;
  const [selected, setSelected] = React.useState([]);

  const combinations = appManager.popCombMgr.combinationsJS;

  const handleSelectAllClick = e => {
    if (e.target.checked) {
      const newSelectedIds = combinations.map((el, i) => i);
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
    appManager.popCombMgr.addEmptyCombination();
  };

  const handleDeleteClick = () => {
    appManager.popCombMgr.removeCombinations(selected);
    setSelected([]);
  }

  const rowCount = combinations.length;
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
            <TableCell width='30%' padding='none'>Combination name</TableCell>
            <TableCell width='35%'>Case-based populations</TableCell>
            <TableCell width='35%'>Aggregated populations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            combinations.map((el, i) => (
              <CombinePopulationsRow
                key={i}
                i={i}
                combination={el}
                appManager={appManager}
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

export default observer(CombinePopulations);

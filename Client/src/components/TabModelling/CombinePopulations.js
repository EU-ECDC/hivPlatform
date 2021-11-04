import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CombinePopulationsRow from './CombinePopulationsRow';
import EnhancedTableToolbar from '../EnhancedTableToolbar';
import RemoveValuesFromArray from '../../utilities/RemoveValuesFromArray';

const CombinePopulations = (props) => {
  const { appMgr } = props;
  const [selected, setSelected] = React.useState([]);

  const combinations = appMgr.popCombMgr.combinationsArray;

  const handleSelectAllClick = e => {
    if (e.target.checked) {
      const newSelectedIds = RemoveValuesFromArray(
        combinations.map(el => el.id),
        appMgr.popCombMgr.combinationAllId
      );
      setSelected(newSelectedIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectClick = id => () => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = RemoveValuesFromArray(selected, id);
    }
    setSelected(newSelected);
  };

  const handleAddClick = () => {
    appMgr.popCombMgr.addEmptyCombination();
  };

  const handleDeleteClick = () => {
    appMgr.popCombMgr.removeCombinations(selected);
    setSelected([]);
  }

  const rowCount = combinations.length - 1;
  const selectedCount = selected.length;
  const isSelected = id => selected.indexOf(id) !== -1;

  return (
    <Paper sx={{ padding: '10px' }}>
      <Typography variant='overline'>Populations combinations</Typography>
      <Table>
        <TableHead>
          <TableRow hover={false}>
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
                combination={el}
                appMgr={appMgr}
                isSelected={isSelected(el.id)}
                onSelectClick={handleSelectClick(el.id)}
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

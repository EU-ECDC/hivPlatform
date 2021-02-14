import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DiagnosisRatesRow from './DiagnosisRatesRow';
import EnhancedTableToolbar from '../EnhancedTableToolbar';

const DiagnosisRates = (props) => {

  const { timeIntCollMgr } = props;
  const [selected, setSelected] = React.useState([]);

  const collection = timeIntCollMgr.selectedEditCollection;

  const intervals = collection.intervals;

  const handleSelectAllClick = e => {
    if (e.target.checked) {
      const newSelectedIds = intervals.map((el, i) => i);
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
    collection.addEmptyInterval();
  };

  const handleDeleteClick = () => {
    collection.removeIntervals(selected);
    setSelected([]);
  }

  const rowCount = intervals.length;
  const selectedCount = selected.length;
  const isSelected = i => selected.indexOf(i) !== -1;

  return (
    <Paper style={{ padding: 10 }}>
      <Typography variant='overline'>Collection: {collection.name}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                inputProps={{ 'aria-label': 'select all' }}
                color='primary'
                onClick={handleSelectAllClick}
                checked={rowCount > 0 && selectedCount === rowCount}
              />            </TableCell>
            <TableCell width='15%' padding='none' >Start year</TableCell>
            <TableCell width='15%' >End year</TableCell>
            <TableCell>Jump</TableCell>
            <TableCell>Change by CD4 count</TableCell>
            <TableCell>Change in interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            intervals.map((el, i) => (
              <DiagnosisRatesRow
                key={i}
                i={i}
                interval={el}
                collection={collection}
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

export default observer(DiagnosisRates);

import React from 'react';
import { observer } from 'mobx-react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import OriginGroupingRow from './OriginGroupingRow';

const EnhancedTableToolbar = (props) => {
  const { selectedCount, onAddClick, onDeleteClick } = props;

  const deleteDisabled = selectedCount === 0;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%' }}>
        {selectedCount} selected
      </Typography>

      <Button color='primary' disabled={deleteDisabled} onClick={onDeleteClick}>Delete</Button>
      <Button color='primary' onClick={onAddClick}>Add</Button>
    </Toolbar>
  );
};

const OriginGroupingsWidget = (props) => {
  const { appManager } = props;
  const [selected, setSelected] = React.useState([]);

  const originGrouping = appManager.originGroupingArray;

  const handleGroupingPresetChange = e => {
    appManager.inputValueSet('groupingPresetSelect', e.target.value);
  };

  const handleSelectAllClick = e => {
    if (e.target.checked) {
      const newSelectedIds = originGrouping.map((el, i) => i);
      setSelected(newSelectedIds);
      return;
    }
    setSelected([]);
  }

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

  const handleDeleteClick = () => {
    appManager.removeOriginGroupings(selected);
    setSelected([]);
  }

  const handleAddClick = () => {
    appManager.addOriginGrouping(selected);
  }

  const rowCount = originGrouping.length;
  const selectedCount = selected.length;
  const isSelected = i => selected.indexOf(i) !== -1;

  return (
    <Paper style={{ padding: 10 }}>
      <Typography variant='overline'>Migrant variable regrouping</Typography>
      <FormControl style={{ width: '100%', fontSize: '0.75rem' }}>
        <InputLabel>
          Preset
      </InputLabel>
        <Select defaultValue='REPCOUNTRY + UNK + OTHER' onChange={handleGroupingPresetChange}>
          <MenuItem value='REPCOUNTRY + UNK + OTHER' dense>REPCOUNTRY + UNK + OTHER</MenuItem>
          <MenuItem value='REPCOUNTRY + UNK + SUBAFR + OTHER' dense>REPCOUNTRY + UNK + SUBAFR + OTHER</MenuItem>
          <MenuItem value='REPCOUNTRY + UNK + 3 most prevalent regions + OTHER' dense>REPCOUNTRY + UNK + 3 most prevalent regions + OTHER</MenuItem>
          <MenuItem value='Custom' dense>Custom</MenuItem>
        </Select>
        <FormHelperText>Select regrouping preset</FormHelperText>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                inputProps={{ 'aria-label': 'select all desserts' }}
                color='primary'
                onClick={handleSelectAllClick}
                checked={rowCount > 0 && selectedCount === rowCount}
              />
            </TableCell>
            <TableCell padding='none'>GroupedRegionOfOrigin</TableCell>
            <TableCell width='60%'>FullRegionOfOrigin</TableCell>
            <TableCell align='right' width='10%'>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            originGrouping.map((el, i) => (
              <OriginGroupingRow
                key={i}
                i={i}
                originGroup={el}
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

export default observer(OriginGroupingsWidget);

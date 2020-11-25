import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

const CombinePopulationsRow = (props) => {
  const { i, isSelected, onSelectClick, combination: el, appManager } = props;

  const handleCombinationNameChange = e => {
    appManager.popCombMgr.setCombinationName(i, e.target.value);
  };

  const handlePopulationsChange = e => {
    appManager.popCombMgr.setCombinationPopulations(i, e.target.value);
  };

  const handleAggrPopulationsChange = e => {
    appManager.popCombMgr.setAggrCombinationPopulations(i, e.target.value);
  };

  let name = null;
  let caseBasedPopulations = null;
  let aggrPopulations = null;
  if (el.name === 'ALL') {
    name = 'ALL';
    caseBasedPopulations = 'All data available';
    aggrPopulations =
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          appManager.aggrDataMgr.populationNames.map((value, i) => (
            <Chip key={value} label={value} style={{ margin: 2 }} />
          ))
        }
      </div>
  } else {
    name = <Input
      style={{ width: '100%', fontSize: '0.75rem' }}
      value={el.name}
      onChange={handleCombinationNameChange}
    />
    caseBasedPopulations = <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} style={{ margin: 2 }} />
          ))}
        </div>
      )}
      value={el.populations}
      style={{ width: '100%', fontSize: '0.75rem' }}
      onChange={handlePopulationsChange}
      disableUnderline
    >
      {
        appManager.popMgr.definedPopulations.map((el2, j) => (
          <MenuItem key={j} value={el2} dense>{el2}</MenuItem>
        ))
      }
    </Select>
    aggrPopulations = <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} style={{ margin: 2 }} />
          ))}
        </div>
      )}
      value={el.aggrPopulations}
      onChange={handleAggrPopulationsChange}
      style={{ width: '100%', fontSize: '0.75rem' }}
      disableUnderline
    >
      {
        appManager.aggrDataMgr.populationNames.map((el2, j) => (
          <MenuItem key={j} value={el2} dense>{el2}</MenuItem>
        ))
      }
    </Select>
  }

  return (
    <TableRow hover role='checkbox'>
      <TableCell padding='checkbox'>
        <Checkbox
          inputProps={{ 'aria-labelledby': `labelId${i}` }}
          color='primary'
          checked={isSelected}
          onClick={onSelectClick}
        />
      </TableCell>
      <TableCell id={`labelId${i}`} scope='row' padding='none'>
        {name}
      </TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        {caseBasedPopulations}
      </TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        {aggrPopulations}
      </TableCell>
    </TableRow>
  )
};

export default observer(CombinePopulationsRow);

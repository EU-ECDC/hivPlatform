import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import ValidationTextField from '../ValidationTextField';

const CombinePopulationsRow = (props) => {
  const { i, isSelected, onSelectClick, combination: el, appMgr } = props;

  const handleCombinationNameChange = (value, valid) => {
    if (valid) {
      appMgr.popCombMgr.setCombinationName(i, value);
    }
  };

  const handlePopulationsChange = e => {
    appMgr.popCombMgr.setCombinationPopulations(i, e.target.value);
  };

  const handleAggrPopulationsChange = e => {
    appMgr.popCombMgr.setAggrCombinationPopulations(i, e.target.value);
  };

  const validateName = name => {
    let result = '';
    if (name === '') {
      result = 'Please, specify a unique name';
    }
    return result;
  };

  let name = null;
  let caseBasedPopulations = null;
  let aggrPopulations = null;
  if (el.name === 'ALL') {
    name = 'ALL';
    caseBasedPopulations = 'All data available';
    aggrPopulations= 'All data available after selection above';
  } else {
    name = <ValidationTextField
      value={el.name}
      validationFunc = {validateName}
      onChange={handleCombinationNameChange}
      helperText = ''
      style={{ width: '100%', fontSize: '0.75rem' }}
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
      disabled={appMgr.popMgr.definedPopulations.length === 0}
      onChange={handlePopulationsChange}
      style={{ width: '100%', fontSize: '0.75rem' }}
      disableUnderline
    >
      {
        appMgr.popMgr.definedPopulations.map((el2, j) => (
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
        appMgr.aggrDataMgr.populationNames.map((el2, j) => (
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

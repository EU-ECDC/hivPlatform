import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import ValidationTextField from '../ValidationTextField';

const CombinePopulationsRow = (props) => {
  const { isSelected, onSelectClick, el, appMgr } = props;

  const handleCombinationNameChange = (value, valid) => {
    if (valid) {
      appMgr.popCombMgr.setCombinationName(el.id, value);
    }
  };

  const handleCasePopulationsChange = e => {
    appMgr.popCombMgr.setCombinationCasePopulations(el.id, e.target.value);
  };

  const handleAggrPopulationsChange = e => {
    appMgr.popCombMgr.setCombinationAggrPopulations(el.id, e.target.value);
  };

  const validateName = name => {
    let result = '';
    if (name === '') {
      result = 'Please, specify a unique name';
    }
    return result;
  };

  let checkBox = null;
  let name = null;
  let casePopulations = null;
  let aggrPopulations = null;
  if (el.id === appMgr.popCombMgr.combinationAllId) {
    name = el.name;
    casePopulations = 'All data available';
    aggrPopulations = 'All data available after selection above';
  } else {
    checkBox = <Checkbox
      inputProps={{ 'aria-labelledby': `labelId${el.id}` }}
      color='primary'
      checked={isSelected}
      onClick={onSelectClick}
    />
    name = <ValidationTextField
      value={el.name}
      validationFunc = {validateName}
      onChange={handleCombinationNameChange}
      helperText = ''
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          fontSize: '0.75rem'
        }
      }}
    />
    casePopulations = <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} sx={{ margin: '2px' }} color='secondary' />
          ))}
        </div>
      )}
      value={el.casePopulations}
      disabled={appMgr.popMgr.definedPopulations.length === 0}
      onChange={handleCasePopulationsChange}
      sx={{
        width: '100%',
        fontSize: '0.75rem',
        '&:before': {
          borderBottom: '0px solid black'
        },
      }}
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
            <Chip key={value} label={value} sx={{ margin: '2px' }} color='secondary' />
          ))}
        </div>
      )}
      value={el.aggrPopulations}
      onChange={handleAggrPopulationsChange}
      sx={{
        width: '100%',
        fontSize: '0.75rem',
        '&:before': {
          borderBottom: '0px solid black'
        },
      }}
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
      <TableCell padding='checkbox' sx={{ verticalAlign: 'top' }}>
        {checkBox}
      </TableCell>
      <TableCell id={`labelId${el.id}`} scope='row' sx={{ padding: '4px 4px 6px 0px', verticalAlign: 'top' }}>
        {name}
      </TableCell>
      <TableCell sx={{ padding: '4px 4px 0px 16px', verticalAlign: 'top' }}>
        {casePopulations}
      </TableCell>
      <TableCell sx={{ padding: '4px 4px 0px 16px', verticalAlign: 'top' }}>
        {aggrPopulations}
      </TableCell>
    </TableRow>
  )
};

export default observer(CombinePopulationsRow);

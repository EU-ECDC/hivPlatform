import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import ValidationTextField from '../ValidationTextField';

const useStyles = makeStyles(() => ({
  textField: {
    '& .MuiInputBase-root': {
      fontSize: '0.75rem'
    }
  }
}));

const CombinePopulationsRow = (props) => {
  const { isSelected, onSelectClick, combination: el, appMgr } = props;

  const classes = useStyles();

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
      style={{ width: '100%' }}
      className={classes.textField}
    />
    casePopulations = <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} style={{ margin: 2 }} />
          ))}
        </div>
      )}
      value={el.casePopulations}
      disabled={appMgr.popMgr.definedPopulations.length === 0}
      onChange={handleCasePopulationsChange}
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
        {checkBox}
      </TableCell>
      <TableCell id={`labelId${el.id}`} scope='row' style={{ padding: '6px 4px 6px 0px' }}>
        {name}
      </TableCell>
      <TableCell style={{ padding: '4px 4px 0px 16px' }}>
        {casePopulations}
      </TableCell>
      <TableCell style={{ padding: '4px 4px 0px 16px' }}>
        {aggrPopulations}
      </TableCell>
    </TableRow>
  )
};

export default observer(CombinePopulationsRow);

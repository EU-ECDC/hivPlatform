import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import ValidationTextField from '../ValidationTextField';
import InArray from '../../utilities/InArray';
import RemoveElementsFromArray from '../../utilities/RemoveElementsFromArray';

const OriginGroupingRow = (props) => {
  const { i, isSelected, onSelectClick, el, appMgr } = props;

  const [name, setName] = React.useState('');
  const [usedNames, setUsedNames] = React.useState([]);

  React.useEffect(() => {
    setName(el.GroupedRegionOfOrigin);
  }, [el.GroupedRegionOfOrigin]);

  React.useEffect(() => {
    setUsedNames(appMgr.origGroupMgr.usedNames);
   }, [appMgr.origGroupMgr.usedNames]);

  const unusedOrigins = appMgr.origGroupMgr.unusedOrigins;
  const menuItems = el.FullRegionOfOrigin.concat(unusedOrigins);
  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const handleGroupedNameChange = (value, valid) => {
    setName(value);
    if (valid) {
      appMgr.origGroupMgr.setGroupName(i, value);
    }
  };

  const validateName = name => {
    name = name.trim();
    let result = '';
    if (name === '') {
      result = 'Name is empty';
    } else if (InArray(name, RemoveElementsFromArray(usedNames, i))) {
      result = 'Name is used';
    }
    return result;
  };

  const handleOriginsChange = e => appMgr.origGroupMgr.setGroupOrigin(i, e.target.value);

  const handleMigrantChange = e => {
    const newValue = e.target.value == '' ? null : e.target.value;
    appMgr.origGroupMgr.setMigrantOrigin(i, newValue);
  }

  const checkBox =
    <Checkbox
      inputProps={{ 'aria-labelledby': `labelId${i}` }}
      color='primary'
      checked={isSelected}
      onClick={onSelectClick}
    />;
  const groupedRegion =
    <ValidationTextField
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          fontSize: '0.75rem'
        }
      }}
      helperText=''
      value={name}
      validationFunc={validateName}
      onChange={handleGroupedNameChange}
      onInput={toInputUppercase}
    />;
  const migrantRegion =
    <Select
      sx={{ width: '100%', fontSize: '0.75rem' }}
      value={el.MigrantRegionOfOrigin || ''}
      onChange={handleMigrantChange}
    >
      <MenuItem value='' dense></MenuItem>
      <MenuItem value='REPCOUNTRY' dense>REPCOUNTRY</MenuItem>
      <MenuItem value='EUROPE-NORTH AMERICA' dense>EUROPE-NORTH AMERICA</MenuItem>
      <MenuItem value='AFRICA' dense>AFRICA</MenuItem>
      <MenuItem value='ASIA' dense>ASIA</MenuItem>
      <MenuItem value='CARIBBEAN-LATIN AMERICA' dense>CARIBBEAN-LATIN AMERICA</MenuItem>
      <MenuItem value='OTHER' dense>OTHER</MenuItem>
      <MenuItem value='UNK' dense>UNK</MenuItem>
    </Select>;
  const fullRegion =
    <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} sx={{ margin: '2px' }} color='info' size='small'/>
          ))}
        </div>
      )}
      value={el.FullRegionOfOrigin}
      sx={{
        width: '100%',
        fontSize: '0.75rem',
        '&:before': {
          borderBottom: '0px solid black'
        },
      }}
      onChange={handleOriginsChange}
    >
      {
        menuItems.map((el2, j) => (
          <MenuItem key={j} value={el2} dense>{el2}</MenuItem>
        ))
      }
    </Select>;

  return (
    <TableRow hover role='checkbox'>
      <TableCell padding='checkbox' sx={{ verticalAlign: 'top' }}>
        { checkBox }
      </TableCell>
      <TableCell id={`labelId${i}`} scope='row' sx={{ padding: '4px 20px 6px 0px', verticalAlign: 'top' }}>
        { groupedRegion }
      </TableCell>
      <TableCell scope='row' sx={{ padding: '4px 4px 6px 0px', verticalAlign: 'top' }}>
        {migrantRegion }
      </TableCell>
      <TableCell sx={{ padding: '0px 4px 0px 16px', verticalAlign: 'top', maxWidth: '300px' }}>
        { fullRegion }
      </TableCell>
      <TableCell align='right' sx={{ padding: '4px 16px 0px 16px', verticalAlign: 'top' }}>{el.groupCount}</TableCell>
    </TableRow>
  )
};

export default observer(OriginGroupingRow);

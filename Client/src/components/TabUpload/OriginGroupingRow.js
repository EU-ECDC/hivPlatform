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
  const [usedNames, setUsedName] = React.useState([]);
  React.useEffect(() => setName(el.name), [el.name]);
  React.useEffect(() => setUsedName(appMgr.origGroupMgr.usedNames), [appMgr.origGroupMgr.usedNames]);

  const unusedOrigins = appMgr.origGroupMgr.unusedOrigins;
  const menuItems = el.origin.concat(unusedOrigins);

  const handleGroupedNameChange = (value, valid) => {
    setName(value);
    if (valid) {
      appMgr.origGroupMgr.setGroupName(i, value);
    }
  };

  const validateName = name => {
    let result = '';
    if (name === '') {
      result = 'Please, specify a non-empty name';
    } else if (InArray(name, RemoveElementsFromArray(usedNames, i))) {
      result = 'Please, specify a name that is not used';
    }
    return result;
  };

  const handleOriginsChange = e => appMgr.origGroupMgr.setGroupOrigin(i, e.target.value);

  const handleMigrantChange = e => appMgr.origGroupMgr.setMigrantOrigin(i, e.target.value);

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
    />;
  const migrantRegion =
    <Select
      sx={{ width: '100%', fontSize: '0.75rem' }}
      value={el.migrant}
      onChange={handleMigrantChange}
    >
      <MenuItem value='REPCOUNTRY' dense>REPCOUNTRY</MenuItem>
      <MenuItem value='UNK' dense>UNK</MenuItem>
      <MenuItem value='EUROPE' dense>EUROPE</MenuItem>
      <MenuItem value='AFRICA' dense>AFRICA</MenuItem>
      <MenuItem value='ASIA' dense>ASIA</MenuItem>
      <MenuItem value='OTHER' dense>OTHER</MenuItem>
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
      value={el.origin}
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
      <TableCell sx={{ padding: '4px 4px 0px 16px', verticalAlign: 'top', maxWidth: '300px' }}>
        { fullRegion }
      </TableCell>
      <TableCell align='right' sx={{ padding: '4px 16px 0px 16px', verticalAlign: 'top' }}>{el.groupCount}</TableCell>
    </TableRow>
  )
};

export default observer(OriginGroupingRow);

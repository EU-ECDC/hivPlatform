import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

const OriginGroupingRow = (props) => {
  const { i, isSelected, onSelectClick,  el, appMgr } = props;

  const unusedOrigins = appMgr.origGroupMgr.unusedOrigins;
  const menuItems = el.origin.concat(unusedOrigins);

  const handleGroupedNameChange = e => {
    appMgr.origGroupMgr.setGroupName(i, e.target.value);
  };

  const handleOriginsChange = e => {
    appMgr.origGroupMgr.setGroupOrigin(i, e.target.value);
  };


  let checkBox = null;
  let groupedRegion = null;
  let fullRegion = null;
  // if (el.name === 'REPCOUNTRY') {
  //   groupedRegion = el.name;
  //   fullRegion = el.origin[0];
  // } else {
    checkBox = <Checkbox
      inputProps={{ 'aria-labelledby': `labelId${i}` }}
      color='primary'
      checked={isSelected}
      onClick={onSelectClick}
    />;
    groupedRegion = <Input
      sx={{ width: '100%', fontSize: '0.75rem' }}
      value={el.name}
      onChange={handleGroupedNameChange}
    />;
    fullRegion = <Select
      multiple
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} sx={{ margin: '2px' }} color='secondary'/>
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
  // }
  return (
    <TableRow hover role='checkbox'>
      <TableCell padding='checkbox' sx={{ verticalAlign: 'top' }}>
        { checkBox }
      </TableCell>
      <TableCell id={`labelId${i}`} scope='row' sx={{ padding: '4px 4px 6px 0px', verticalAlign: 'top' }}>
        { groupedRegion }
      </TableCell>
      <TableCell sx={{ padding: '4px 4px 0px 16px', verticalAlign: 'top', maxWidth: '300px' }}>
        { fullRegion }
      </TableCell>
      <TableCell align='right' sx={{ padding: '4px 16px 0px 16px', verticalAlign: 'top' }}>{el.groupCount}</TableCell>
    </TableRow>
  )
};

export default observer(OriginGroupingRow);

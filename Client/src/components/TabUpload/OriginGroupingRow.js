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
  const { i, isSelected, onSelectClick,  grouping:el, appMgr } = props;

  const unusedOrigins = appMgr.origGroupMgr.unusedOrigins;
  const menuItems = el.origin.concat(unusedOrigins);

  const handleGroupedNameChange = e => {
    appMgr.origGroupMgr.setGroupName(i, e.target.value);
  };

  const handleOriginsChange = e => {
    appMgr.origGroupMgr.setGroupOrigin(i, e.target.value);
  };

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
        <Input
          sx={{ width: '100%', fontSize: '0.75rem' }}
          value={el.name}
          onChange={handleGroupedNameChange}
        />
      </TableCell>
      <TableCell sx={{ padding: '4px 16px 0px 16px', maxWidth: '300px' }}>
        <Select
          multiple
          renderValue={selected => (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {selected.map(value => (
                <Chip key={value} label={value} style={{ margin: 2 }} />
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
        </Select>
      </TableCell>
      <TableCell align='right'>{el.groupCount}</TableCell>
    </TableRow>
  )
};

export default observer(OriginGroupingRow);

import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

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
          style={{ width: '100%', fontSize: '0.75rem' }}
          value={el.name}
          onChange={handleGroupedNameChange}
        />
      </TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px', maxWidth: 300 }}>
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
          style={{ width: '100%', fontSize: '0.75rem' }}
          onChange={handleOriginsChange}
          disableUnderline
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

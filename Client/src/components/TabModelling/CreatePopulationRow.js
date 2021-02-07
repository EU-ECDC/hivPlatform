import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import FormatPercentage from '../../utilities/FormatPercentage';
import PercentageToShade from '../../utilities/PercentageToShade';

const CreatePopulationRow = (props) => {
  const { i, isSelected, onSelectClick, population: el, appMgr } = props;

  const handleStrataChange = e => {
    appMgr.popMgr.setPopulationVariables(i, e.target.value);
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
          value={el.variables}
          style={{ width: '100%', fontSize: '0.75rem' }}
          onChange={handleStrataChange}
          disableUnderline
        >
          {
            appMgr.popMgr.availableVariables.map((el2, j) => (
              <MenuItem key={j} value={el2.Name} dense>{`${el2.Name} (${el2.Code})`}</MenuItem>
            ))
          }
        </Select>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {el.strata.map((el2) => (
            <Chip
              key={el2.Combination}
              label={`${el2.Combination} (${FormatPercentage(el2.Perc)})`}
              style={{
                margin: 2,
                backgroundColor: `${PercentageToShade(el2.Perc, 214)}`
              }}
            />
          ))}
        </div>
      </TableCell>
    </TableRow>
  )
};

export default observer(CreatePopulationRow);

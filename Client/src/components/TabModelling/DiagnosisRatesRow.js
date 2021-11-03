import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';

const DiagnosisRatesRow = (props) => {
  const { i, isSelected, onSelectClick, interval: el, collection } = props;

  const handleStartYearChange = e => collection.setIntervalStartYear(i, e.target.value);
  const handleJumpChange = e => collection.setIntervalJump(i, e.target.checked);
  const handleChangeInIntervalChange = e => collection.setIntervalChangeInInterval(i, e.target.checked);
  const handleDiffByCD4Change = e => collection.setIntervalDiffByCD4(i, e.target.checked);

  let startYearWidget = null;
  if (i === 0) {
    startYearWidget = el.startYear;
  } else {
    startYearWidget = <Input
      style={{ width: '100%', fontSize: '0.75rem' }}
      value={el.startYear}
      type='number'
      onChange={handleStartYearChange}
    />
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
      <TableCell id='labelId1' scope='row' padding='none'>{startYearWidget}</TableCell>
      <TableCell sx={{textAlign: 'center'}}>{el.endYear}</TableCell>
      <TableCell padding='checkbox' sx={{textAlign: 'center'}}><Checkbox color='primary' checked={el.jump} onChange={handleJumpChange} /></TableCell>
      <TableCell padding='checkbox' sx={{textAlign: 'center'}}><Checkbox color='primary' checked={el.diffByCD4} onChange={handleDiffByCD4Change} /></TableCell>
      <TableCell padding='checkbox' sx={{textAlign: 'center'}}><Checkbox color='primary' checked={el.changeInInterval} onChange={handleChangeInIntervalChange} /></TableCell>
    </TableRow>
  )
};

export default observer(DiagnosisRatesRow);

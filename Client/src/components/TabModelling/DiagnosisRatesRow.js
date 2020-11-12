import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';

const DiagnosisRatesRow = (props) => {
  const { i, isSelected, onSelectClick, interval: el, appManager } = props;

  const handleStartYearChange = e => appManager.modelMgr.timeIntMgr.setIntervalStartYear(i, e.target.value);
  const handleJumpChange = e => appManager.modelMgr.timeIntMgr.setIntervalJump(i, e.target.checked);
  const handleChangeInIntervalChange = e => appManager.modelMgr.timeIntMgr.setIntervalChangeInInterval(i, e.target.checked);
  const handleDiffByCD4Change = e => appManager.modelMgr.timeIntMgr.setIntervalDiffByCD4(i, e.target.checked);

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
      <TableCell>{el.endYear}</TableCell>
      <TableCell padding='checkbox'><Checkbox color='primary' checked={el.jump} onChange={handleJumpChange} /></TableCell>
      <TableCell padding='checkbox'><Checkbox color='primary' checked={el.changeInInterval} onChange={handleChangeInIntervalChange}/></TableCell>
      <TableCell padding='checkbox'><Checkbox color='primary' checked={el.diffByCD4} onChange={handleDiffByCD4Change}/></TableCell>
    </TableRow>
  )
};

export default observer(DiagnosisRatesRow);

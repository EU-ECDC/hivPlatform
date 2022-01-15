import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import FormatNumber from '../utilities/FormatNumber';
import FormatPercentage from '../utilities/FormatPercentage';
import MergeObjects from '../utilities/MergeObjects';
import IsNull from '../utilities/IsNull';

const StyledTableCell = ({ isTotal, value, lb, ub, isPerc = false, ...rest }) => {

  const FormatFunc = isPerc ? FormatPercentage : FormatNumber;

  const style = isTotal ? {
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9'
  } : null;

  let printValue = null;
  let isNumber = false;
  if (!IsNull(value)) {
    isNumber = !isNaN(value);
    printValue = isNumber ? FormatFunc(value) : value;
  } else {
    if (!IsNull(lb) && !IsNull(ub)) {
      printValue = `${FormatFunc(lb)} - ${FormatFunc(ub)}`;
      isNumber = true;
    }
  }

  const align = isNumber ? 'right' : 'left';
  const opts = MergeObjects({align: align}, rest);

  return (
    <TableCell {...opts} sx={style}>{printValue}</TableCell>
  )
};

export default observer(StyledTableCell);

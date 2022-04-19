import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import FormatNumber from '../utilities/FormatNumber';
import FormatPercentage from '../utilities/FormatPercentage';
import MergeObjects from '../utilities/MergeObjects';
import IsNull from '../utilities/IsNull';

const StyledTableCell = ({ isTotal, value, lb, ub, isPerc = false, decimals = 0, ...rest }) => {

  const FormatFunc = isPerc ? FormatPercentage : FormatNumber;

  const style = isTotal ? {
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9'
  } : null;

  let isNumber = !isNaN(value) && value !== '';
  let printValue = '';
  if (!IsNull(value)) {
    printValue = FormatFunc(value, decimals);
  } else {
    if (!IsNull(lb) && !IsNull(ub)) {
      printValue = `${FormatFunc(lb, decimals)} - ${FormatFunc(ub, decimals)}`;
      isNumber = true;
    }
  }

  const align = isNumber ? 'right' : 'left';
  const opts = MergeObjects({ align: align }, rest);

  return (
    <TableCell {...opts} sx={style}>{printValue}</TableCell>
  )
};

export default observer(StyledTableCell);

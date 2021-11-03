import React from 'react';
import { observer } from 'mobx-react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';

const AggregatedDataPopulationsRow = (props) => {

  const { i, rowCount, dataFile, appMgr } = props;

  const handleUseChange = e => {
    appMgr.aggrDataMgr.setDataFileUse(dataFile.name, e.target.checked);
  };

  const handleYearsChange = (e, years) => {
    appMgr.aggrDataMgr.setDataFileYears(dataFile.name, years);
  };

  let lastColumn = null;
  if (rowCount === 1 || (rowCount > 1 && i === 0)) {
    lastColumn =
      <TableCell rowSpan={rowCount} sx={{pt: 5, pr: 3, pb: 1}}>
        <Slider
          min={appMgr.aggrDataMgr.rangeYears[0]}
          max={appMgr.aggrDataMgr.rangeYears[1]}
          marks={true}
          value={dataFile.years}
          onChange={handleYearsChange}
          sx={{
            '& *': {
              fontSize: '9px'
            }
          }}
          valueLabelDisplay='on'
          valueLabelFormat={value => value.toFixed()}
          aria-labelledby='range-slider'
          getAriaLabel={index => index.toFixed()}
          getAriaValueText={value => value.toFixed()}
          color='secondary'
        />
      </TableCell>
  }

  return (
    <TableRow>
      <TableCell>{dataFile.name}</TableCell>
      <TableCell>
        <Switch color='primary' checked={dataFile.use} onChange={handleUseChange} size='small' />
      </TableCell>
      { lastColumn }
    </TableRow>
  )
};

export default observer(AggregatedDataPopulationsRow);

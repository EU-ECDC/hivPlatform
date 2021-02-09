import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(() => ({
  valueLabel: {
    top: -15,
    '& *': {
      background: 'transparent',
      fontSize: 11
    },
  },
}));

const AggregatedDataPopulationsRow = (props) => {
  const classes = useStyles();

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
      <TableCell rowSpan={rowCount}>
        <Slider
          min={1975}
          max={2025}
          marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
          value={dataFile.years}
          onChange={handleYearsChange}
          classes={{
            valueLabel: classes.valueLabel
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

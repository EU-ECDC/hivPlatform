import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';

const AggregatedDataPopulations = (props) => {
  const { appManager } = props;


  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='20%'>Data type</TableCell>
            <TableCell width='20%'>Use</TableCell>
            <TableCell width='60%'>Years</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>AIDS</TableCell>
            <TableCell><Switch color='primary' defaultChecked size='small' /></TableCell>
            <TableCell>
              <Slider
                min={1975}
                max={2025}
                marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
                defaultValue={[1980, 2015]}
                valueLabelDisplay='auto'
                valueLabelFormat={value => value.toFixed()}
                aria-labelledby='range-slider'
                getAriaLabel={index => index.toFixed()}
                getAriaValueText={value => value.toFixed()}
                color='secondary'
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Dead</TableCell>
            <TableCell><Switch color='primary' defaultChecked size='small' /></TableCell>
            <TableCell>
              <Slider
                min={1975}
                max={2025}
                marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
                defaultValue={[1980, 2015]}
                valueLabelDisplay='auto'
                valueLabelFormat={value => value.toFixed()}
                aria-labelledby='range-slider'
                getAriaLabel={index => index.toFixed()}
                getAriaValueText={value => value.toFixed()}
                color='secondary'
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
};

export default observer(AggregatedDataPopulations);

import React from 'react';
import { observer } from 'mobx-react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import IsNull from '../../utilities/IsNull';
import StyledTableCell from '../StyledTableCell';

const PropTable = ({ migrMgr }) => {

  const propTable = migrMgr.confBounds;

  const handleStratChange = (e, strat) => {
    console.log(strat);
    migrMgr.setPropTableStrat(strat);
  }

  let stratButtons = null;
  if (!IsNull(propTable)) {
    stratButtons =
      <ToggleButtonGroup
        size='small'
        color='primary'
        value={migrMgr.propTableStrat}
        onChange={handleStratChange}
        sx={{marginBottom: '5px'}}
      >
        <ToggleButton value='Gender'>Sex</ToggleButton>
        <ToggleButton value='AgeGroup'>Age Group</ToggleButton>
        <ToggleButton value='Transmission'>Transmission</ToggleButton>
        <ToggleButton value='GroupedRegionOfOrigin'>Grouped Region Of Origin</ToggleButton>
      </ToggleButtonGroup>
  };

  const isTotal = false;
  let tableEl = null;
  if (IsNull(propTable)) {
    tableEl = <div>No table data available</div>
  } else {
    tableEl =
      <Table size='small'>
        <TableHead>
          <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
            <TableCell width='220px' rowSpan={2}>Category</TableCell>
            <TableCell align='right' rowSpan={2}>Count</TableCell>
            <TableCell align='right' colSpan={2} sx={{textAlign: 'center'}}>Infected prior to arrival</TableCell>
            <TableCell align='right' colSpan={2} sx={{textAlign: 'center'}}>Infected post arrival</TableCell>
          </TableRow>
          <TableRow hover={false} sx={{ backgroundColor: '#bedfe1' }}>
            <TableCell align='right'>Proportion</TableCell>
            <TableCell align='right'>95% CI</TableCell>
            <TableCell align='right'>Proportion</TableCell>
            <TableCell align='right'>95% CI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            propTable.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell value={r.Category} isTotal={isTotal} />
                <StyledTableCell value={r.Count} isTotal={isTotal} />
                <StyledTableCell value={r.PriorProp} isTotal={isTotal} isPerc={true} />
                <StyledTableCell lb={r.PriorPropLB} ub={r.PriorPropUB} isTotal={isTotal} isPerc={true} />
                <StyledTableCell value={r.PostProp} isTotal={isTotal} isPerc={true} />
                <StyledTableCell lb={r.PostPropLB} ub={r.PostPropUB} isTotal={isTotal} isPerc={true} />
              </TableRow>))
          }
        </TableBody>
      </Table>
  }

  return (
    <React.Fragment>
      {/* {stratCheckBoxes} */}
      {stratButtons}
      {tableEl}
    </React.Fragment>
  )
};

export default observer(PropTable);

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
import Title from '../Title';
import StyledTableCell from '../StyledTableCell';

const TableSection = ({ section, isTotal = false, caption = '' }) => {

  let rows = [];
  if (caption !== '') {
    rows = [
      <TableRow key={-1}>
        <StyledTableCell value={caption} isTotal={true} colSpan={6} />
      </TableRow>
    ];
  }

  rows = rows.concat(section.map((r, i) => (
    <TableRow key={i}>
      <StyledTableCell value={r.Category} isTotal={isTotal} />
      <StyledTableCell value={r.Count} isTotal={isTotal} />
      <StyledTableCell value={r.PriorProp} isTotal={isTotal} isPerc={true} />
      <StyledTableCell lb={r.PriorPropLB} ub={r.PriorPropUB} isTotal={isTotal} isPerc={true} />
      <StyledTableCell value={r.PostProp} isTotal={isTotal} isPerc={true} />
      <StyledTableCell lb={r.PostPropLB} ub={r.PostPropUB} isTotal={isTotal} isPerc={true} />
    </TableRow>
  )));

  return (rows);
};

const TableDistr = (props) => {
  const { migrMgr } = props;

  const handleTableRegionChange = e => migrMgr.setTableRegion(e.target.value);

  const tableDistr = migrMgr.tableDistr;

  let regionButtons = null;
  if (!IsNull(migrMgr.yodDistr)) {
    regionButtons =
      <ToggleButtonGroup
        exclusive
        size='small'
        color='primary'
        value={migrMgr.tableRegion}
        onChange={handleTableRegionChange}
        sx={{marginBottom: '5px'}}
      >
        <ToggleButton value='ALL'>ALL</ToggleButton>
        <ToggleButton value='AFRICA'>AFRICA</ToggleButton>
        <ToggleButton value='EUROPE-NORTH AMERICA'>EUROPE-NORTH AMERICA</ToggleButton>
        <ToggleButton value='ASIA'>ASIA</ToggleButton>
        <ToggleButton value='OTHER'>OTHER</ToggleButton>
      </ToggleButtonGroup>
  };

  let tableEl = null;
  if (IsNull(tableDistr)) {
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
          <TableSection section={tableDistr.Total} isTotal={true} />
          <TableSection section={tableDistr.Sex} caption='Sex:' />
          <TableSection section={tableDistr.AgeGroup} caption='Age Group:'/>
          <TableSection section={tableDistr.Transmission} caption='Transmission:'/>
          <TableSection section={tableDistr.RegionOfOrigin} caption='Region Of Origin:'/>
        </TableBody>
      </Table>
  }

  return (
    <React.Fragment>
      <Title>Table 2. Proportion of migrants infected post arrival by sex, age group and transmission category</Title>
      {regionButtons}
      {tableEl}
    </React.Fragment>
  )
};

export default observer(TableDistr);

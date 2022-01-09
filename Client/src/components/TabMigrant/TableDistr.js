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
        <ToggleButton value='All'>All</ToggleButton>
        <ToggleButton value='Africa'>Africa</ToggleButton>
        <ToggleButton value='Europe-North America'>Europe-North America</ToggleButton>
        <ToggleButton value='Asia'>Asia</ToggleButton>
        <ToggleButton value='Other'>Other</ToggleButton>
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
          <TableRow>
            <StyledTableCell value='Total' isTotal={true} />
            <StyledTableCell value={tableDistr.Total.Count} isTotal={true} />
            <StyledTableCell value={tableDistr.Total.PriorProp} isTotal={true} />
            <StyledTableCell value={`${tableDistr.Total.PriorLB} - ${tableDistr.Total.PriorUB}`} isTotal={true} />
            <StyledTableCell value={tableDistr.Total.PostProp} isTotal={true} />
            <StyledTableCell value={`${tableDistr.Total.PostLB} - ${tableDistr.Total.PostUB}`} isTotal={true} />
          </TableRow>
          {
            tableDistr.Sex.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell value={r.Category} isTotal={i === 0} />
                <StyledTableCell value={r.Count} isTotal={i === 0} />
                <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
              </TableRow>
            ))
          }
          {
          tableDistr.Age.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell value={r.Category} isTotal={i === 0} />
                <StyledTableCell value={r.Count} isTotal={i === 0} />
                <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
              </TableRow>
            ))
          }
          {
          tableDistr.Transmission.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell value={r.Category} isTotal={i === 0} />
                <StyledTableCell value={r.Count} isTotal={i === 0} />
                <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
              </TableRow>
            ))
          }
          {
          tableDistr.RegionOfOrigin.map((r, i) => (
              <TableRow key={i}>
                <StyledTableCell value={r.Category} isTotal={i === 0} />
                <StyledTableCell value={r.Count} isTotal={i === 0} />
                <StyledTableCell value={r.PriorProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PriorLB} - ${r.PriorUB}`} isTotal={i === 0} />
                <StyledTableCell value={r.PostProp} isTotal={i === 0} />
                <StyledTableCell value={`${r.PostLB} - ${r.PostUB}`} isTotal={i === 0} />
              </TableRow>
            ))
          }
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

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CheckIcon from '@material-ui/icons/Check';
import Btn from './Btn';

const AttributeMapping = (props) => {
  const { appManager } = props;

  let attrMappingSelectOptions = [];
  if (appManager.caseBasedDataColumnNames !== null) {
    attrMappingSelectOptions = appManager.caseBasedDataColumnNames.slice().sort().map(colName => (
      <MenuItem key={colName} value={colName} dense>{colName}</MenuItem>
    ));
  }

  const onAttributeChange = attribute => e => {
    console.log(attribute, e.target.value);
  }

  const attrMappingTableRows = appManager.attrMappingMgr.mappingArray.map(entry => (
    <TableRow hover key={entry.Key}>
      <TableCell>{entry.Key}</TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        <Select
          style={{ width: '100%', fontSize: '0.75rem' }}
          value={entry.Val}
          onChange={onAttributeChange(entry.Key)}
          disableUnderline
        >
          <MenuItem value='' dense>&nbsp;</MenuItem>
          {attrMappingSelectOptions}
        </Select>
      </TableCell>
      <TableCell style={{ padding: '4px 16px 0px 16px' }}>
        <Input style={{ width: '100%', fontSize: '0.75rem' }}></Input>
      </TableCell>
    </TableRow>
  ));

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Btn style={{ marginBottom: 6 }}><AssignmentIcon />&nbsp;Apply mapping</Btn>
        <Typography variant='body2' color='textSecondary'>
          Input data set to be mapped to internal attributes.<br />
          Adjust mapping and press 'Apply mapping' button.
        </Typography>
        <Typography variant='body2' style={{marginTop: 10}}>
          <CheckIcon style={{ width: '0.75rem', height: '0.75rem' }} />
          {appManager.attrMappingMgr.meta.msg}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Paper style={{ padding: 10 }}>
          <Typography variant='overline'>Attribute mapping</Typography>
          <Grid container spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width='30%'>Attribute</TableCell>
                  <TableCell width='40%'>Uploaded data column</TableCell>
                  <TableCell width='30%'>Override value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attrMappingTableRows}
              </TableBody>
            </Table>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default observer(AttributeMapping);

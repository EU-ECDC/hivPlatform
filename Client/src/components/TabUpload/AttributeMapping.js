import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Input from '@mui/material/Input';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Btn from '../Btn';
import MessageAlert from '../MessageAlert';

const AttributeMapping = (props) => {
  const { appMgr } = props;

  let attrMappingSelectOptions = [];
  if (appMgr.caseBasedDataMgr.columnNames !== null) {
    attrMappingSelectOptions = appMgr.caseBasedDataMgr.columnNames.slice().sort().concat('');
  }

  const onApplyBtnClick = () => appMgr.attrMappingMgr.applyMapping();

  const onOrigColSelect = attribute => (e, origColName) => {
    appMgr.attrMappingMgr.setOrigCol(attribute, origColName);
  }

  const onDefValChange = attribute => e => {
    appMgr.attrMappingMgr.setDefVal(attribute, e.target.value);
  }

  const attrMappingTableRows = appMgr.attrMappingMgr.mapping.map((entry, idx) => (
    <TableRow key={idx}>
      <TableCell>{`${idx+1}.`}</TableCell>
      <TableCell>{entry.attribute}</TableCell>
      <TableCell sx={{ padding: '4px 16px 0px 16px' }}>
        <Autocomplete
          value={entry.origColName || ''}
          onChange={onOrigColSelect(entry.attribute)}
          options={attrMappingSelectOptions}
          renderInput={(params) => <TextField {...params} />}
          sx={{
            input: {
              fontSize: '0.75rem'
            }
          }}
          autoComplete={true}
          autoHighlight={true}
          autoSelect={true}
          selectOnFocus={true}
          clearOnBlur={true}
          handleHomeEndKeys={true}
          blurOnSelect={true}
          clearOnEscape={true}
        />
      </TableCell>
      <TableCell sx={{ padding: '4px 16px 0px 16px' }}>
        <Input
          sx={{ width: '100%', fontSize: '0.75rem' }}
          onChange={onDefValChange(entry.attribute)}
          disabled={!!entry.origColName}
        />
      </TableCell>
      <TableCell><Typography variant='overline'>{ entry.type }</Typography></TableCell>
    </TableRow>
  ));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>
          Attribute mapping
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Btn
          sx={{ marginBottom: '6px', color: 'white' }}
          onClick={onApplyBtnClick}
          disabled={!appMgr.attrMappingMgr.actionValid}
        >
          <AssignmentIcon />&nbsp;Apply mapping
        </Btn>
        <Typography variant='body2' color='textSecondary'>
          Input data must mapped to internal attributes.<br />
          Adjust mapping and press 'Apply mapping' button.
        </Typography>
        <MessageAlert
          valid={appMgr.attrMappingMgr.actionValid}
          msg={appMgr.attrMappingMgr.actionMessage}
        />
      </Grid>
      <Grid item xs={10}>
        <Paper sx={{ padding: '10px' }}>
          <Typography variant='overline'>Attribute mapping</Typography>
          <Table>
            <TableHead>
              <TableRow hover={false}>
                <TableCell width='8%'>Idx</TableCell>
                <TableCell width='23%'>Attribute</TableCell>
                <TableCell width='23%'>Uploaded data column</TableCell>
                <TableCell width='23%'>Override value</TableCell>
                <TableCell width='23%'>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attrMappingTableRows}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default observer(AttributeMapping);

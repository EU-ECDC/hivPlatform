import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const TabAdjustments = () => {

  return (
    <Grid container>
      <Grid item xs={3}>
        1. Multiple Imputations adjustment
      </Grid>
      <Grid item xs={9}>
        <FormControl style={{minWidth: 300, marginBottom: 30}}>
          <InputLabel id="demo-simple-select-filled-label">Multiple Imputations</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={10}>Joint Modelling</MenuItem>
            <MenuItem value={20}>Chained Equations - MICE</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        2. Reporting Delays adjustment
      </Grid>
      <Grid item xs={9}>
        <FormControl style={{ minWidth: 300 }}>
          <InputLabel id="demo-simple-select-filled-label">Reporting Delays</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={10}>Without trend</MenuItem>
            <MenuItem value={20}>With trend</MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </Grid>
  );
};

export default TabAdjustments;

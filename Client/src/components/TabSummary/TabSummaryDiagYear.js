import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import HistChart from '../Charts/HistChart';

const TabSummaryDiagYear = (props) => {
  const { appMgr } = props;

  const handleDiagYearFilterSwitchChange = e =>
    appMgr.summaryDataMgr.setDiagYearFilterApply(e.target.checked);

  const handleDiagYearFilterYearChange = (e, value) => {
    appMgr.summaryDataMgr.setDiagYearFilterMinYear(value[0]);
    appMgr.summaryDataMgr.setDiagYearFilterMaxYear(value[1]);
  };

  return (
    <React.Fragment>
      <Grid item xs={2}>
        <FormControlLabel
          control={
            <Switch
              checked={appMgr.summaryDataMgr.diagYearPlotData.filter.applyInAdjustments}
              onChange={handleDiagYearFilterSwitchChange}
              color='primary'
              size='small'
            />
          }
          label='Apply this data selection in adjustments'
        />
      </Grid>
      <Grid item xs={10}>
        <Paper style={{ padding: 10 }}>
          <Typography variant='overline'>Diagnosis year</Typography>
          <div style={{ padding: '40px 105px 0 65px' }}>
            <Slider
              min={appMgr.summaryDataMgr.diagYearPlotData.filter.scaleMinYear}
              max={appMgr.summaryDataMgr.diagYearPlotData.filter.scaleMaxYear}
              marks={true}
              value={[
                appMgr.summaryDataMgr.diagYearPlotData.filter.valueMinYear,
                appMgr.summaryDataMgr.diagYearPlotData.filter.valueMaxYear
              ]}
              onChange={handleDiagYearFilterYearChange}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
              sx={{
                '& *': {
                  fontSize: '9px'
                }
              }}
            />
          </div>
          <HistChart
            xAxisLabel='Diagnosis year'
            xCategories={appMgr.summaryDataMgr.diagYearPlotData.chartCategories}
            maleData={appMgr.summaryDataMgr.diagYearPlotData.chartData[0].data}
            femaleData={appMgr.summaryDataMgr.diagYearPlotData.chartData[1].data}
          />
        </Paper>
      </Grid>
    </React.Fragment>
  )
};

export default observer(TabSummaryDiagYear);

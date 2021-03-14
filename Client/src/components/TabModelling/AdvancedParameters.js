import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(() => ({
  valueLabel: {
    top: -15,
    '& *': {
      background: 'transparent',
      fontSize: 11
    },
  },
}));

const YearsSlider = (props) => {
  const { minYear, maxYear, value, onChange } = props;

  const classes = useStyles();

  return (
    <Slider
      min={minYear}
      max={maxYear}
      value={value}
      onChange={onChange}
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
  )
};

const AdvancedParameters = (props) => {
  const { appMgr } = props;

  const handleYearsChange = (e, years) => {
    appMgr.modelMgr.setMinYear(years[0]);
    appMgr.modelMgr.setMaxYear(years[1]);
  };

  const handleFitPosChange = (e, years) => {
    appMgr.modelMgr.setMinFitPos(years[0]);
    appMgr.modelMgr.setMaxFitPos(years[1]);
  };

  const handleFitCD4Change = (e, years) => {
    appMgr.modelMgr.setMinFitCD4(years[0]);
    appMgr.modelMgr.setMaxFitCD4(years[1]);
  };

  const handleFitAIDSChange = (e, years) => {
    appMgr.modelMgr.setMinFitAIDS(years[0]);
    appMgr.modelMgr.setMaxFitAIDS(years[1]);
  };

  const handleFitHIVAIDSChange = (e, years) => {
    appMgr.modelMgr.setMinFitHIVAIDS(years[0]);
    appMgr.modelMgr.setMaxFitHIVAIDS(years[1]);
  };

  const handleFullDataChange = e => appMgr.modelMgr.setFullData(e.target.value === 'true');

  const handleKnotsCountChange = e => appMgr.modelMgr.setKnotsCount(e.target.value);

  const handleStartIncZeroChange = e => appMgr.modelMgr.setStartIncZero(e.target.value === 'true');

  const handleMaxIncCorrChange = e => appMgr.modelMgr.setMaxIncCorr(e.target.value === 'true');

  const handleDistributionFitChange = e => appMgr.modelMgr.setDistributionFit(e.target.value);

  const handleDelta4FacChange = e => appMgr.modelMgr.setDelta4Fac(e.target.value);

  const handleCountryChange = e => appMgr.modelMgr.setCountry(e.target.value);

  const minYear = appMgr.modelMgr.optimalYears.All[0] - 1;
  const maxYear = appMgr.modelMgr.optimalYears.All[1];

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width='50px'>Idx</TableCell>
            <TableCell width='330px'>Parameter</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1.</TableCell>
            <TableCell>Range of calculations</TableCell>
            <TableCell>
              <YearsSlider
                minYear={minYear}
                maxYear={maxYear}
                value={[appMgr.modelMgr.minYear, appMgr.modelMgr.maxYear]}
                onChange={handleYearsChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2.</TableCell>
            <TableCell>HIV diagnoses, total</TableCell>
            <TableCell>
              <YearsSlider
                minYear={minYear}
                maxYear={maxYear}
                value={[appMgr.modelMgr.minFitPos, appMgr.modelMgr.maxFitPos]}
                onChange={handleFitPosChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3.</TableCell>
            <TableCell>HIV diagnoses, by CD4 count</TableCell>
            <TableCell>
              <YearsSlider
                minYear={minYear}
                maxYear={maxYear}
                value={[appMgr.modelMgr.minFitCD4, appMgr.modelMgr.maxFitCD4]}
                onChange={handleFitCD4Change}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4.</TableCell>
            <TableCell>AIDS diagnoses, total</TableCell>
            <TableCell>
              <YearsSlider
                minYear={minYear}
                maxYear={maxYear}
                value={[appMgr.modelMgr.minFitAIDS, appMgr.modelMgr.maxFitAIDS]}
                onChange={handleFitAIDSChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5.</TableCell>
            <TableCell>HIV/AIDS diagnoses, total</TableCell>
            <TableCell>
              <YearsSlider
                minYear={minYear}
                maxYear={maxYear}
                value={[appMgr.modelMgr.minFitHIVAIDS, appMgr.modelMgr.maxFitHIVAIDS]}
                onChange={handleFitHIVAIDSChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>6.</TableCell>
            <TableCell>Do you have data from the start of the epidemic?</TableCell>
            <TableCell>
              <RadioGroup row value={appMgr.modelMgr.fullData} onChange={handleFullDataChange}>
                <FormControlLabel value={true} control={<Radio color='primary' />} label='Yes' />
                <FormControlLabel value={false} control={<Radio color='primary' />} label='No' />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>7.</TableCell>
            <TableCell>Knots count</TableCell>
            <TableCell>
              <Input
                style={{ width: '120px', fontSize: '0.75rem' }}
                value={appMgr.modelMgr.knotsCount}
                onChange={handleKnotsCountChange}
                type='number'
                inputProps={{
                  min: 2, max: 10
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>8.</TableCell>
            <TableCell>Start at zero</TableCell>
            <TableCell>
              <RadioGroup row value={appMgr.modelMgr.startIncZero} onChange={handleStartIncZeroChange}>
                <FormControlLabel value={true} control={<Radio color='primary' />} label='Yes' />
                <FormControlLabel value={false} control={<Radio color='primary' />} label='No' />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>9.</TableCell>
            <TableCell>Prevent sudden changes at end of observation interval</TableCell>
            <TableCell>
              <RadioGroup row value={appMgr.modelMgr.maxIncCorr} onChange={handleMaxIncCorrChange}>
                <FormControlLabel value={true} control={<Radio color='primary' />} label='Yes' />
                <FormControlLabel value={false} control={<Radio color='primary' />} label='No' />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>10.</TableCell>
            <TableCell>Maximum likelihood distribution</TableCell>
            <TableCell>
              <RadioGroup row value={appMgr.modelMgr.distributionFit} onChange={handleDistributionFitChange}>
                <FormControlLabel value='POISSON' control={<Radio color="primary" />} label='Poisson' />
                <FormControlLabel value='NEGATIVE_BINOMIAL' control={<Radio color="primary" />} label='Negative Binomial' />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>11.</TableCell>
            <TableCell>Extra diagnosis rate due to non-AIDS symptoms</TableCell>
            <TableCell>
              <Input
                style={{ width: '120px', fontSize: '0.75rem' }}
                value={appMgr.modelMgr.delta4Fac}
                onChange={handleDelta4FacChange}
                type='number'
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>12.</TableCell>
            <TableCell>Country-specific settings</TableCell>
            <TableCell>
              <Select
                value={appMgr.modelMgr.country}
                onChange={handleCountryChange}
                style={{ width: '120px', fontSize: '0.75rem' }}
              >
                <MenuItem value='OTHER' dense>Other</MenuItem>
                <MenuItem value='NL' dense>NL</MenuItem>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
};

export default observer(AdvancedParameters);

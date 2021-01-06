import React from 'react';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const YearsSlider = (props) => {
  const { minYear, maxYear, onChange } = props;

  return (
    <Slider
      min={1975}
      max={2025}
      marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
      value={[minYear, maxYear]}
      onChange={onChange}
      valueLabelDisplay='on'
      valueLabelFormat={value => value.toFixed()}
      aria-labelledby='range-slider'
      getAriaLabel={index => index.toFixed()}
      getAriaValueText={value => value.toFixed()}
      color='secondary'
    />
  )
}

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

  const handleFullDataChange = e => appMgr.modelMgr.setFullData(e.target.checked);

  const handleKnotsCountChange = e => appMgr.modelMgr.setKnotsCount(e.target.value);

  const handleStartIncZeroChange = e => appMgr.modelMgr.setStartIncZero(e.target.checked);

  const handleMaxIncCorrChange = e => appMgr.modelMgr.setMaxIncCorr(e.target.checked);

  const handleDistributionFitChange = e => appMgr.modelMgr.setDistributionFit(e.target.value);

  const handleDelta4FacChange = e => appMgr.modelMgr.setDelta4Fac(e.target.value);

  const handleCountryChange = e => appMgr.modelMgr.setCountry(e.target.value);

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>1. Range of calculations</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appMgr.modelMgr.minYear}
                maxYear={appMgr.modelMgr.maxYear}
                onChange={handleYearsChange}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>2. HIV diagnoses, total</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appMgr.modelMgr.minFitPos}
                maxYear={appMgr.modelMgr.maxFitPos}
                onChange={handleFitPosChange}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>3. HIV diagnoses, by CD4 count</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appMgr.modelMgr.minFitCD4}
                maxYear={appMgr.modelMgr.maxFitCD4}
                onChange={handleFitCD4Change}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>4. AIDS diagnoses, total</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appMgr.modelMgr.minFitAIDS}
                maxYear={appMgr.modelMgr.maxFitAIDS}
                onChange={handleFitAIDSChange}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>5. HIV/AIDS diagnoses, total</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appMgr.modelMgr.minFitHIVAIDS}
                maxYear={appMgr.modelMgr.maxFitHIVAIDS}
                onChange={handleFitHIVAIDSChange}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>6. Full/partial data</Typography>
            <Grid container>
              <Grid item xs={6}>Do you have data from the start of the epidemic</Grid>
              <Grid item xs={6}>
                <Switch
                  color='primary'
                  checked={appMgr.modelMgr.fullData}
                  onChange={handleFullDataChange}
                  size='small'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>7. Incidence curve</Typography>
            <Grid container>
              <Grid item xs={6}>Knots count</Grid>
              <Grid item xs={6}>
                <Input
                  style={{ width: '100%', fontSize: '0.75rem' }}
                  value={appMgr.modelMgr.knotsCount}
                  onChange={handleKnotsCountChange}
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>Start at zero</Grid>
              <Grid item xs={6}>
                <Switch
                  color='primary'
                  checked={appMgr.modelMgr.startIncZero}
                  onChange={handleStartIncZeroChange}
                  size='small'
                />
              </Grid>
              <Grid item xs={6}>Prevent sudden changes at end of observation interval</Grid>
              <Grid item xs={6}>
                <Switch
                  color='primary'
                  checked={appMgr.modelMgr.maxIncCorr}
                  onChange={handleMaxIncCorrChange}
                  size='small'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>8. Maximum likelihood</Typography>
            <Grid container>
              <Grid item xs={6}>Distrbution</Grid>
              <Grid item xs={6}>
                <RadioGroup row value={appMgr.modelMgr.distributionFit} onChange={handleDistributionFitChange}>
                  <FormControlLabel value='POISSON' control={<Radio color="primary" />} label='Poisson' />
                  <FormControlLabel value='NEGATIVE_BINOMIAL' control={<Radio color="primary" />} label='Negative Binomial' />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>9. Diagnosis rate</Typography>
            <Grid container>
              <Grid item xs={6}>Extra rate due to non-AIDS symptoms</Grid>
              <Grid item xs={6}>
                <Input
                  style={{ width: '100%', fontSize: '0.75rem' }}
                  value={appMgr.modelMgr.delta4Fac}
                  onChange={handleDelta4FacChange}
                  type='number'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>10. Country-specific settings</Typography>
            <Grid container>
              <Grid item xs={6}>Country</Grid>
              <Grid item xs={6}>
                <Select
                  value={appMgr.modelMgr.country}
                  onChange={handleCountryChange}
                  style={{ width: '100%', fontSize: '0.75rem' }}
                >
                  <MenuItem value='OTHER' dense>Other</MenuItem>
                  <MenuItem value='NL' dense>NL</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
};

export default observer(AdvancedParameters);

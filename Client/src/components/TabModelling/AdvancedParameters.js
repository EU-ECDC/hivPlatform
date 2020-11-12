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
  const { appManager } = props;

  const handleYearsChange = (e, years) => {
    appManager.modelMgr.setMinYear(years[0]);
    appManager.modelMgr.setMaxYear(years[1]);
  };

  const handleFitPosChange = (e, years) => {
    appManager.modelMgr.setMinFitPos(years[0]);
    appManager.modelMgr.setMaxFitPos(years[1]);
  };

  const handleFitCD4Change = (e, years) => {
    appManager.modelMgr.setMinFitCD4(years[0]);
    appManager.modelMgr.setMaxFitCD4(years[1]);
  };

  const handleFitAIDSChange = (e, years) => {
    appManager.modelMgr.setMinFitAIDS(years[0]);
    appManager.modelMgr.setMaxFitAIDS(years[1]);
  };

  const handleFitHIVAIDSChange = (e, years) => {
    appManager.modelMgr.setMinFitHIVAIDS(years[0]);
    appManager.modelMgr.setMaxFitHIVAIDS(years[1]);
  };

  const handleFullDataChange = e => appManager.modelMgr.setFullData(e.target.checked);

  const handleKnotsCountChange = e => appManager.modelMgr.setKnotsCount(e.target.value);

  const handleStartIncZeroChange = e => appManager.modelMgr.setStartIncZero(e.target.checked);

  const handleMaxIncCorrChange = e => appManager.modelMgr.setMaxIncCorr(e.target.checked);

  const handleDistributionFitChange = e => appManager.modelMgr.setDistributionFit(e.target.value);

  const handleDelta4FacChange = e => appManager.modelMgr.setDelta4Fac(e.target.value);

  const handleCountryChange = e => appManager.modelMgr.setCountry(e.target.value);

  return (
    <Paper>
      <Grid container>
        <Grid item xs={12}>
          <Box style={{ padding: 10 }}>
            <Typography variant='overline'>1. Range of calculations</Typography>
            <div style={{ padding: '40px 10px 0 10px' }}>
              <YearsSlider
                minYear={appManager.modelMgr.minYear}
                maxYear={appManager.modelMgr.maxYear}
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
                minYear={appManager.modelMgr.minFitPos}
                maxYear={appManager.modelMgr.maxFitPos}
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
                minYear={appManager.modelMgr.minFitCD4}
                maxYear={appManager.modelMgr.maxFitCD4}
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
                minYear={appManager.modelMgr.minFitAIDS}
                maxYear={appManager.modelMgr.maxFitAIDS}
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
                minYear={appManager.modelMgr.minFitHIVAIDS}
                maxYear={appManager.modelMgr.maxFitHIVAIDS}
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
                  checked={appManager.modelMgr.fullData}
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
                  value={appManager.modelMgr.knotsCount}
                  onChange={handleKnotsCountChange}
                  type='number'
                />
              </Grid>
              <Grid item xs={6}>Start at zero</Grid>
              <Grid item xs={6}>
                <Switch
                  color='primary'
                  checked={appManager.modelMgr.startIncZero}
                  onChange={handleStartIncZeroChange}
                  size='small'
                />
              </Grid>
              <Grid item xs={6}>Prevent sudden changes at end of observation interval</Grid>
              <Grid item xs={6}>
                <Switch
                  color='primary'
                  checked={appManager.modelMgr.maxIncCorr}
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
                <RadioGroup row value={appManager.modelMgr.distributionFit} onChange={handleDistributionFitChange}>
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
                  value={appManager.modelMgr.delta4Fac}
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
                  value={appManager.modelMgr.country}
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

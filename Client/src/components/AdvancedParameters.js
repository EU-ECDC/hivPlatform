import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const userStyles = makeStyles({
  valueLabel: {
    '& span': {
      '& span': {
        // color: 'white',
        fontSize: 8
      }
    }
  }
});

const AdvancedParameters = () => (
  <Paper>
    <Grid container>
      <Grid item xs={12}>
        <Box style={{ padding: 10 }}>
          <Typography variant='overline'>1. Range of calculations</Typography>
          <div style={{ padding: '40px 10px 0 10px' }}>
            <Slider
              min={1975}
              max={2025}
              marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
              defaultValue={[1980, 2015]}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
            />
          </div>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ padding: 10 }}>
          <Typography variant='overline'>2. HIV diagnoses, total</Typography>
          <div style={{ padding: '40px 10px 0 10px' }}>
            <Slider
              min={1975}
              max={2025}
              marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
              defaultValue={[1979, 1979]}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
            />
          </div>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ padding: 10 }}>
          <Typography variant='overline'>3. HIV diagnoses, by CD4 count</Typography>
          <div style={{ padding: '40px 10px 0 10px' }}>
            <Slider
              min={1975}
              max={2025}
              marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
              defaultValue={[2000, 2014]}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
            />
          </div>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ padding: 10 }}>
          <Typography variant='overline'>4. AIDS diagnoses, total</Typography>
          <div style={{ padding: '40px 10px 0 10px' }}>
            <Slider
              min={1975}
              max={2025}
              marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
              defaultValue={[1995, 1995]}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
            />
          </div>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ padding: 10 }}>
          <Typography variant='overline'>5. HIV/AIDS diagnoses, total</Typography>
          <div style={{ padding: '40px 10px 0 10px' }}>
            <Slider
              min={1975}
              max={2025}
              marks={[{ value: 1975, label: '1975' }, { value: 2025, label: '2025' }]}
              defaultValue={[2000, 2014]}
              valueLabelDisplay='on'
              valueLabelFormat={value => value.toFixed()}
              aria-labelledby='range-slider'
              getAriaLabel={index => index.toFixed()}
              getAriaValueText={value => value.toFixed()}
              color='secondary'
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
              <Switch color='primary' defaultChecked size='small'/>
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
              <Input style={{ width: '100%', fontSize: '0.75rem' }} value='4' type='number' />
            </Grid>
            <Grid item xs={6}>Start at zero</Grid>
            <Grid item xs={6}>
              <Switch color='primary' defaultChecked size='small' />
            </Grid>
            <Grid item xs={6}>Prevent sudden changes at end of observation interval</Grid>
            <Grid item xs={6}>
              <Switch color='primary' defaultChecked size='small' />
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
              <RadioGroup row defaultValue='POISSON'>
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
              <Input style={{ width: '100%', fontSize: '0.75rem' }} value='0' />
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
                value={'None'}
                style={{ width: '100%', fontSize: '0.75rem' }}
              >
                <MenuItem value='None' dense>None</MenuItem>
                <MenuItem value='NL' dense>NL</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

export default AdvancedParameters;

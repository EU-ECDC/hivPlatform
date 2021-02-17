import React from 'react';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Chart from 'react-apexcharts';
import TabPanel from '../TabPanel';
import { defaultHIVOutput1ChartOptions } from '../ChartsData';

const TabModellingTables = props => {

  const { appMgr } = props;

  const handleNextpageBtnClick = e => appMgr.uiStateMgr.setActivePageId(5);

  const hivOutput1ChartOptions = defaultHIVOutput1ChartOptions;

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              size='small'
              color='primary'
              onClick={handleNextpageBtnClick}
            >
              Next step
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            HIV Modelling results
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <RadioGroup
              name='repDelDataSelection'
              defaultValue='INDIVIDUAL'
            >
              <FormControlLabel
                value='INDIVIDUAL'
                control={<Radio color='primary' size='small' />}
                label='Individual'
              />
              <FormControlLabel
                value='COMBINED'
                control={<Radio color='primary' size='small' />}
                label='Combined'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Chart
              options={hivOutput1ChartOptions}
              series={[
                {
                  data: [
                    [1980, 1],
                    [1981, 15],
                    [1982, 56]
                  ]
                },
                {
                  data: [
                    [1980, 15],
                    [1981, 5],
                    [1982, 45]
                  ]
                }
              ]}
              type='area'
              height={400}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabModellingTables);

import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TabPanel from './TabPanel';
import Btn from './Btn';

const TabReports = (props) => {

  const { appMgr } = props;

  const handleCreateReportBtnClick = e => {
    appMgr.btnClicked('createReportBtn');
  };

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>
            Select report
          </Typography>
          <FormControl style={{ width: '100%', marginTop: 20, marginBottom: 20 }}>
            <Select
              value={1}
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              <MenuItem value={1} dense>Report on adjusted data</MenuItem>
            </Select>
            <FormHelperText>Select report type</FormHelperText>
          </FormControl>
          <Btn
            onClick={handleCreateReportBtnClick}
          >
            Create report
          </Btn>
          <Button color='primary' style={{ marginLeft: 20 }} disabled>Cancel</Button>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Report on adjusted data parameters</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={true} onChange={() => { }} name='1' color='primary' />}
                label='Adjust count of cases for reporting delay'
              />
              <FormControlLabel
                control={<Checkbox checked={false} onChange={() => { }} name='2' color='primary' />}
                label='Apply plot curves smoothing'
              />
              <FormControlLabel
                control={<Checkbox checked={false} onChange={() => { }} name='3' color='primary' />}
                label='Plot inter-quartile range in CD4 count plots'
              />
            </FormGroup>
            <Button color='primary'>Restore defaults</Button>
            <Button color='primary'>Apply</Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Divider light style={{ margin: '30px 0' }} />
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body1'>
            Download as
          </Typography>
          <FormControl style={{ width: '100%', marginTop: 20, marginBottom: 20 }}>
            <Select
              value='html'
              style={{ width: '100%', fontSize: '0.75rem' }}
            >
              <MenuItem value='html' dense>HTML</MenuItem>
              <MenuItem value='pdf' dense>PDF</MenuItem>
              <MenuItem value='latex' dense>Latex</MenuItem>
              <MenuItem value='word' dense>Word</MenuItem>
            </Select>
            <FormHelperText>Select document format</FormHelperText>
          </FormControl>
          <Btn disabled><CloudDownloadIcon />&nbsp;Download</Btn>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <div
              dangerouslySetInnerHTML={{ __html: appMgr.report }}
              style={{ overflowX: 'auto' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabReports);

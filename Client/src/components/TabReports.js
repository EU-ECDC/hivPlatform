import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import BookIcon from '@material-ui/icons/Book';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TabPanel from './TabPanel';
import Btn from './Btn';

const TabReports = () => {

  return (
    <TabPanel>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button size='small' color='primary'>Next step</Button>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography variant='body1'>
            Select report
          </Typography>
          <FormControl component='fieldset'>
            <RadioGroup name='reportName' defaultValue='mainReport'>
              <FormControlLabel
                value='mainReport'
                control={<Radio color='primary' size='small' />}
                label='Main report'
              />
            </RadioGroup>
          </FormControl><br />
          <Btn><BookIcon />&nbsp;Create report</Btn>
          <Button color='primary' style={{ marginLeft: 20 }}>Cancel</Button>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <Typography variant='overline'>Main report parameters</Typography>
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
          <FormControl component='fieldset'>
            <RadioGroup name='fileType' defaultValue='pdf'>
              <FormControlLabel
                value='html'
                control={<Radio color='primary' size='small' />}
                label='HTML'
              />
              <FormControlLabel
                value='pdf'
                control={<Radio color='primary' size='small' />}
                label='PDF'
              />
              <FormControlLabel
                value='latex'
                control={<Radio color='primary' size='small' />}
                label='Latex'
              />
              <FormControlLabel
                value='word'
                control={<Radio color='primary' size='small' />}
                label='MS Word'
              />
            </RadioGroup>
          </FormControl><br />
          <Btn><CloudDownloadIcon />&nbsp;Download</Btn>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: 10 }}>
            <div id="introduction" className="section level1">
              <h1><span className="header-section-number">1</span> Introduction</h1>
              <p>Input data:</p>
              <ul>
                <li>No filter on diagnosis year applied.</li>
              </ul>
              <p>Adjustments:</p>
              <ul>
                <li>Reporting Delays
                  <ul>
                    <li>Diagnosis start year: 2000</li>
                    <li>Notification end year: 2017</li>
                    <li>Notification end quarter (integer between 1 and 4): 1</li>
                    <li>Gender: FALSE</li>
                    <li>Transmission: FALSE</li>
                    <li>Migration: FALSE</li>
                  </ul></li>
              </ul>
              <p>Report options:</p>
              <ul>
                <li>Correction of count of cases for reporting delay.</li>
                <li>Original calendar time.</li>
                <li>CD4 plots without inter-quartile range.</li>
              </ul>
              <hr />
            </div>
            <div id="comparison-of-data-by-gender" className="section level1">
              <h1><span className="header-section-number">2</span> Comparison of data by Gender</h1>
              <div id="number-of-diagnoses-per-year" className="section level2">
                <h2><span className="header-section-number">2.1</span> Number of diagnoses per year</h2>
                <p>Data stratified by <em>gender</em> is shown only for unadjusted data since there were no missing data on <em>gender</em> after pre-processing, which takes place before adjustments.</p>
                <div id="before-and-after-adjustments" className="section level3">
                  <h3><span className="header-section-number">2.1.1</span> Before and after adjustments</h3>
                  <table>
                    <thead>
                      <tr className="header">
                        <th align="right">Year of diagnosis</th>
                        <th align="right">Male [N (%)]</th>
                        <th align="right">Female [N (%)]</th>
                        <th align="right">Total [N (%)]</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd">
                        <td align="right">2000</td>
                        <td align="right">183 (62)</td>
                        <td align="right">112 (38)</td>
                        <td align="right">295 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2001</td>
                        <td align="right">235 (61)</td>
                        <td align="right">149 (39)</td>
                        <td align="right">384 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2002</td>
                        <td align="right">269 (57)</td>
                        <td align="right">206 (43)</td>
                        <td align="right">475 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2003</td>
                        <td align="right">324 (57)</td>
                        <td align="right">245 (43)</td>
                        <td align="right">569 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2004</td>
                        <td align="right">358 (58)</td>
                        <td align="right">260 (42)</td>
                        <td align="right">618 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2005</td>
                        <td align="right">359 (55)</td>
                        <td align="right">290 (45)</td>
                        <td align="right">649 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2006</td>
                        <td align="right">376 (62)</td>
                        <td align="right">233 (38)</td>
                        <td align="right">609 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2007</td>
                        <td align="right">406 (66)</td>
                        <td align="right">211 (34)</td>
                        <td align="right">617 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2008</td>
                        <td align="right">386 (65)</td>
                        <td align="right">212 (35)</td>
                        <td align="right">598 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2009</td>
                        <td align="right">373 (65)</td>
                        <td align="right">201 (35)</td>
                        <td align="right">574 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2010</td>
                        <td align="right">387 (70)</td>
                        <td align="right">168 (30)</td>
                        <td align="right">555 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2011</td>
                        <td align="right">398 (73)</td>
                        <td align="right">147 (27)</td>
                        <td align="right">545 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2012</td>
                        <td align="right">398 (74)</td>
                        <td align="right">139 (26)</td>
                        <td align="right">537 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">2013</td>
                        <td align="right">381 (78)</td>
                        <td align="right">108 (22)</td>
                        <td align="right">489 (100)</td>
                      </tr>
                      <tr className="odd">
                        <td align="right">2014</td>
                        <td align="right">80 (76)</td>
                        <td align="right">25 (24)</td>
                        <td align="right">105 (100)</td>
                      </tr>
                      <tr className="even">
                        <td align="right">Total</td>
                        <td align="right">4913 (64)</td>
                        <td align="right">2706 (36)</td>
                        <td align="right">7619 (100)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
                <div id="median-cd4-cell-count-cellsµl" className="section level2">
                  <h2><span className="header-section-number">2.2</span> Median CD4 cell count (cells/µL)</h2>
                  <div id="before-adjustments" className="section level3">
                    <h3><span className="header-section-number">2.2.1</span> Before adjustments</h3>
                      <table>
                        <colgroup>
                          <col width="21%" />
                          <col width="24%" />
                          <col width="26%" />
                          <col width="27%" />
                        </colgroup>
                        <thead>
                          <tr className="header">
                            <th align="right">Year of diagnosis</th>
                            <th align="right">Male [Median (IQR)]</th>
                            <th align="right">Female [Median (IQR)]</th>
                            <th align="right">Overall [Median (IQR)]</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="odd">
                            <td align="right">2000</td>
                            <td align="right">319 (103, 563)</td>
                            <td align="right">294 (98, 431)</td>
                            <td align="right">312 (100, 542)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2001</td>
                            <td align="right">345 (104, 531)</td>
                            <td align="right">320 (181, 568)</td>
                            <td align="right">340 (142, 533)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2002</td>
                            <td align="right">323 (100, 480)</td>
                            <td align="right">220 (63, 380)</td>
                            <td align="right">300 (84, 465)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2003</td>
                            <td align="right">353 (180, 548)</td>
                            <td align="right">272 (133, 392)</td>
                            <td align="right">333 (161, 522)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2004</td>
                            <td align="right">324 (159, 490)</td>
                            <td align="right">320 (177, 468)</td>
                            <td align="right">320 (165, 484)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2005</td>
                            <td align="right">362 (221, 538)</td>
                            <td align="right">300 (110, 435)</td>
                            <td align="right">340 (163, 521)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2006</td>
                            <td align="right">360 (200, 538)</td>
                            <td align="right">249 (133, 405)</td>
                            <td align="right">332 (164, 508)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2007</td>
                            <td align="right">388 (251, 605)</td>
                            <td align="right">299 (172, 430)</td>
                            <td align="right">370 (240, 586)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2008</td>
                            <td align="right">353 (189, 549)</td>
                            <td align="right">217 (126, 395)</td>
                            <td align="right">329 (156, 531)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2009</td>
                            <td align="right">408 (254, 600)</td>
                            <td align="right">266 (106, 397)</td>
                            <td align="right">372 (198, 576)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2010</td>
                            <td align="right">364 (201, 539)</td>
                            <td align="right">266 (179, 520)</td>
                            <td align="right">354 (195, 533)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2011</td>
                            <td align="right">388 (234, 550)</td>
                            <td align="right">323 (188, 580)</td>
                            <td align="right">382 (229, 555)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2012</td>
                            <td align="right">451 (239, 594)</td>
                            <td align="right">360 (154, 522)</td>
                            <td align="right">420 (228, 582)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">2013</td>
                            <td align="right">430 (264, 610)</td>
                            <td align="right">449 (193, 606)</td>
                            <td align="right">430 (259, 611)</td>
                          </tr>
                          <tr className="odd">
                            <td align="right">2014</td>
                            <td align="right">493 (268, 596)</td>
                            <td align="right">340 (238, 489)</td>
                            <td align="right">456 (256, 583)</td>
                          </tr>
                          <tr className="even">
                            <td align="right">Overall</td>
                            <td align="right">380 (201, 560)</td>
                            <td align="right">290 (133, 460)</td>
                            <td align="right">358 (180, 545)</td>
                          </tr>
                        </tbody>
                      </table>
                      <p>CD4 cell count after adjustments is not available since no imputation adjustements have been run.</p>
                      <hr />
                    </div>
                  </div>
                </div>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabReports;

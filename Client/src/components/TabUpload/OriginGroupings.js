import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import Btn from '../Btn';
import OriginGroupingsWidget from './OriginGroupingsWidget';

const OriginGroupings = (props) => {
  const { appManager } = props;

  const distribution = appManager.origGroupMgr.distributionArray;

  const onApplyClick = () => appManager.origGroupMgr.applyGroupings();

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Btn style={{ marginBottom: 6 }} onClick={onApplyClick}>
          <GroupIcon />&nbsp;Apply regrouping
        </Btn>
        <Typography variant='body2' color='textSecondary'>
          Distribution of region of origin (all regions in dataset in descending frequency of occurrence)
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>FullRegionOfOrigin</TableCell><TableCell align='right'>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              distribution.map((el, i) => (
                <TableRow hover key={i}>
                  <TableCell>{el.origin}</TableCell>
                  <TableCell align='right'>{el.count}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={9}>
        <OriginGroupingsWidget appManager={appManager} />
      </Grid>
    </Grid>
  )
};

export default observer(OriginGroupings);

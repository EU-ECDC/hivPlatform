import React from 'react';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TabPanel from './TabPanel';

// const useRowStyles = makeStyles({
//   root: {
//     '& > *': {
//       borderBottom: 'unset',
//     },
//   },
// });

// const Row = (props) => {
//   const { row } = props;
//   const [open, setOpen] = React.useState(false);
//   const classes = useRowStyles();

//   return (
//     <React.Fragment>
//       <TableRow className={classes.root} hover>
//         {/* <TableCell>
//           <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell> */}
//         <TableCell>{row.description}</TableCell>
//         <TableCell>{row.timestamp}</TableCell>
//         <TableCell></TableCell>
//       </TableRow>
//       {/* <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
//           <Collapse in={open} timeout='auto' unmountOnExit>
//             <Box margin={1}>
//               <Table size='small' aria-label='purchases'>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Format</TableCell>
//                     <TableCell>URL</TableCell>
//                     <TableCell>Size</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {row.formats.map((formatRow) => (
//                     <TableRow key={formatRow.format}>
//                       <TableCell>{formatRow.format}</TableCell>
//                       <TableCell>{formatRow.url}</TableCell>
//                       <TableCell>{formatRow.size}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow> */}
//     </React.Fragment>
//   );
// }

const TabOutputs = (props) => {
  const { appMgr } = props;

  const downloadLinkIds = ['downAdjDataCSV', 'downAdjDataRDS', 'downAdjDataDTA'];

  React.useEffect(
    () => {
      appMgr.unbindShiny(downloadLinkIds);
      appMgr.bindShiny();

      return () => appMgr.unbindShiny(downloadLinkIds);
    }
  );

  return (
    <TabPanel>
      <Grid container spacing={2} style={{ paddingTop: 43 }}>
        <Grid item xs={12}>
          <Typography variant='h6'>
            Outputs
          </Typography>
        </Grid>
        <Grid item xs={2}>
          Adjustments
        </Grid>
        <Grid item xs={10}>
          <Paper style={{ padding: 10 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Format</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Adjusted case-based data</TableCell>
                  <TableCell>{new Date().toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href='#' id='downAdjDataCSV' className='shiny-download-link'>csv (text)</Link>&nbsp;|&nbsp;
                    <Link href='#' id='downAdjDataRDS' className='shiny-download-link'>rds (R)</Link>&nbsp;|&nbsp;
                    <Link href='#' id='downAdjDataDTA' className='shiny-download-link'>dta (Stata)</Link>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default observer(TabOutputs);

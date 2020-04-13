import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const TableToolbar = props => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%' }}>
        {numSelected} selected
      </Typography>
      <Button color='primary' disabled>Delete</Button>
      <Button color='primary'>Add</Button>
    </Toolbar>
  );
};

export default TableToolbar;

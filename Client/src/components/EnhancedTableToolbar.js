import React from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const EnhancedTableToolbar = (props) => {
  const { selectedCount, onAddClick, onDeleteClick, addDisabled } = props;

  const deleteDisabled = selectedCount === 0;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%' }}>
        {selectedCount} selected
      </Typography>

      <Button color='primary' disabled={deleteDisabled} onClick={onDeleteClick}>Delete</Button>
      <Button color='primary' disabled={addDisabled} onClick={onAddClick}>Add</Button>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;

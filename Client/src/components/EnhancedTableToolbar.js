import React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const EnhancedTableToolbar = (props) => {
  const { selectedCount, onAddClick, onDeleteClick } = props;

  const deleteDisabled = selectedCount === 0;

  return (
    <Toolbar>
      <Typography variant='subtitle1' component='div' style={{ flex: '1 1 100%' }}>
        {selectedCount} selected
      </Typography>

      <Button color='primary' disabled={deleteDisabled} onClick={onDeleteClick}>Delete</Button>
      <Button color='primary' onClick={onAddClick}>Add</Button>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;

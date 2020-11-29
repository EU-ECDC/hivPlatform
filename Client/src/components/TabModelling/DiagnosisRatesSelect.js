import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const DiagnosisRatesSelect = props => {
  const { timeIntCollMgr } = props;

  const deleteDisabled = timeIntCollMgr.defaultEditCollectionSelected;

  const handleAddClick = () => timeIntCollMgr.addNewCollection();

  const handleDeleteClick = () => timeIntCollMgr.deleteSelectedEditCollection();

  const handleCollectionChange = e => timeIntCollMgr.setSelectedEditCollectionId(e.target.value);

  return (
    <React.Fragment>
      <Select
        value={timeIntCollMgr.selectedEditCollectionId}
        onChange={handleCollectionChange}
        style={{ width: '100%', fontSize: '0.75rem' }}
      >
        {timeIntCollMgr.collectionsArray.map((el, i) => (
          <MenuItem key={i} value={el.id} dense>{el.name}</MenuItem>
        ))}
      </Select>
      <Button color='primary' onClick={handleDeleteClick} disabled={deleteDisabled}>Delete</Button>
      <Button color='primary' onClick={handleAddClick}>Add</Button>
    </React.Fragment>

  );
};

export default observer(DiagnosisRatesSelect);

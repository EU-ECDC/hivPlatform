import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const DiagnosisRatesSelect = props => {
  const { timeIntCollMgr } = props;

  const deleteDisabled = timeIntCollMgr.defaultSelected;

  const handleAddClick = () => timeIntCollMgr.addCollection();

  const handleDeleteClick = () => timeIntCollMgr.deleteSelectedCollection();

  const handleCollectionChange = e => timeIntCollMgr.setSelectedCollectionId(e.target.value);

  return (
    <React.Fragment>
      <Select
        value={timeIntCollMgr.selectedCollectionId}
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

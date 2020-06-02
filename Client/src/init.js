import { DEBUG } from './settings';

export default appManager => {
  if (!DEBUG) return;

  appManager.setMode('ALL-IN-ONE');
  appManager.setActiveStep(1);

  appManager.setCaseBasedDataColumnNames(['recordid', 'reportingcountry', 'age', 'gender', 'placeofresidence']);

  appManager.setCaseBasedDataAttributeMapping({
    RecordId: 'recordid',
    ReportingCountry: 'reportingcountry',
    Age: 'age',
    Gender: 'gender'
  });
};

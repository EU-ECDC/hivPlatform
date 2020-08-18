import { DEBUG } from './settings';

export default appManager => {
  if (!DEBUG) return;

  appManager.setMode('ALL-IN-ONE');
  appManager.setActiveStepId(1);

  appManager.setCaseBasedDataColumnNames(['recordid', 'reportingcountry', 'age', 'gender', 'placeofresidence']);

  appManager.attrMappingMgr.setMapping([
    { attribute: 'RecordId', origColName: 'recordid', defaultValue: null },
    { attribute: 'ReportingCountry', origColName: 'reportingcountry', defaultValue: null },
    { attribute: 'Age', origColName: 'age', defaultValue: null },
    { attribute: 'Gender', origColName: 'gender', defaultValue: null },
    { attribute: 'DateOfArt', origColName: null, defaultValue: null }
  ]);

  let temp1 = {
    "Type": "CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED",
    "Status": "SUCCESS",
    "Payload": {
      "OriginDistribution": {
        "origin": ["REPCOUNTRY", "SUBAFR", "WESTEUR", "SOUTHASIA", "CENTEUR", "CAR", "LATAM", "EASTEUR", "NORTHAM", "NORTHAFRMIDEAST", "EASTASIAPAC", "AUSTNZ", "UNK"],
        "count": [1562, 2237, 1119, 164, 144, 123, 107, 58, 49, 43, 36, 33, 1944]
      }
    }
  }
  appManager.onShinyEvent(temp1);

  let temp2 = {
    "Type": "CASE_BASED_DATA_ORIGIN_GROUPING_SET",
    "Status": "SUCCESS",
    "Payload": {
      "OriginGrouping": [
        { "name": "UNK", "origin": ["UNK"], "groupCount": [1944] },
        { "name": "OTHER", "origin": ["ABROAD", "AUSTNZ", "CAR", "CENTEUR", "EASTASIAPAC", "EASTEUR", "EUROPE", "LATAM", "NORTHAFRMIDEAST", "NORTHAM", "SOUTHASIA", "SUBAFR", "WESTEUR"], "groupCount": [4113] },
        { "name": "REPCOUNTRY", "origin": ["REPCOUNTRY"], "groupCount": [1562] }
      ]
    }
  }
  appManager.onShinyEvent(temp2);
};

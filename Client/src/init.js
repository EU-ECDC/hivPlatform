import { DEBUG } from './settings';

export default appManager => {
  if (!DEBUG) return;

  appManager.setMode('ALL-IN-ONE');
  appManager.setActiveStepId(1);

  appManager.setCaseBasedDataColumnNames(['recordid', 'reportingcountry', 'age', 'gender', 'placeofresidence']);

  appManager.setCaseBasedDataAttributeMapping({
    RecordId: 'recordid',
    ReportingCountry: 'reportingcountry',
    Age: 'age',
    Gender: 'gender'
  });

  let temp1 = {
    "Type": "CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED",
    "Status": "SUCCESS",
    "Payload": {
      "OriginDistribution": {
        "FullRegionOfOrigin": ["REPCOUNTRY", "SUBAFR", "WESTEUR", "SOUTHASIA", "CENTEUR", "CAR", "LATAM", "EASTEUR", "NORTHAM", "NORTHAFRMIDEAST", "EASTASIAPAC", "AUSTNZ", "UNK"],
        "Count": [1562, 2237, 1119, 164, 144, 123, 107, 58, 49, 43, 36, 33, 1944]
      }
    }
  }
  appManager.onShinyEvent(temp1);

  let temp2 = {
    "Type": "CASE_BASED_DATA_ORIGIN_GROUPING_SET",
    "Status": "SUCCESS",
    "Payload": {
      "OriginGrouping": [
        {
          "GroupedRegionOfOrigin": "UNK",
          "FullRegionsOfOrigin": "UNK",
          "GroupedRegionOfOriginCount": 1944
        },
        {
          "GroupedRegionOfOrigin": "OTHER",
          "FullRegionsOfOrigin": ["ABROAD", "AUSTNZ", "CAR", "CENTEUR", "EASTASIAPAC", "EASTEUR", "EUROPE", "LATAM", "NORTHAFRMIDEAST", "NORTHAM", "SOUTHASIA", "SUBAFR", "WESTEUR"],
          "GroupedRegionOfOriginCount": 4113
        },
        {
          "GroupedRegionOfOrigin": "REPCOUNTRY",
          "FullRegionsOfOrigin": "REPCOUNTRY",
          "GroupedRegionOfOriginCount": 1562
        }
      ]
    }
  }
  appManager.onShinyEvent(temp2);
};

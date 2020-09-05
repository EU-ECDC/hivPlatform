import { DEBUG } from './settings';

export default appManager => {
  if (!DEBUG) return;

  appManager.setMode('ALL-IN-ONE');
  appManager.setActiveStepId(2);

  // 1. Upload data
  appManager.onShinyEvent({
    Type: "CASE_BASED_DATA_UPLOADED",
    Status: "SUCCESS",
    Payload: {
      FileName: 'asd',
      FilePath: 'asds',
      FileSize: 4000,
      FileType: 'asdas'
    }
  });

  // 2. Read data
  appManager.onShinyEvent({
    Type: "CASE_BASED_DATA_READ",
    Status: "SUCCESS",
    Payload: {
      ColumnNames: ['recordid', 'reportingcountry', 'age', 'gender'],
      RecordCount: 400,
      AttributeMapping: [
        { attribute: 'RecordId', origColName: 'recordid', defaultValue: null },
        { attribute: 'ReportingCountry', origColName: 'reportingcountry', defaultValue: null },
        { attribute: 'Age', origColName: 'age', defaultValue: null },
        { attribute: 'Gender', origColName: 'gender', defaultValue: null },
        { attribute: 'DateOfArt', origColName: null, defaultValue: null }
      ]
    }
  });

  // 3. Compute origin distribution
  appManager.onShinyEvent({
    Type: "CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED",
    Status: "SUCCESS",
    Payload: {
      OriginDistribution: {
        origin: ["REPCOUNTRY", "SUBAFR", "WESTEUR", "SOUTHASIA", "CENTEUR", "CAR", "LATAM", "EASTEUR", "NORTHAM", "NORTHAFRMIDEAST", "EASTASIAPAC", "AUSTNZ", "UNK"],
        count: [1562, 2237, 1119, 164, 144, 123, 107, 58, 49, 43, 36, 33, 1944]
      }
    }
  });

  // 4. Set origin grouping
  appManager.onShinyEvent({
    Type: "CASE_BASED_DATA_ORIGIN_GROUPING_SET",
    Status: "SUCCESS",
    Payload: {
      OriginGrouping: [
        { name: "UNK", origin: ["UNK"], groupCount: [1944] },
        { name: "OTHER", origin: ["ABROAD", "AUSTNZ", "CAR", "CENTEUR", "EASTASIAPAC", "EASTEUR", "EUROPE", "LATAM", "NORTHAFRMIDEAST", "NORTHAM", "SOUTHASIA", "SUBAFR", "WESTEUR"], groupCount: [4113] },
        { name: "REPCOUNTRY", origin: ["REPCOUNTRY"], groupCount: [1562] }
      ],
      OriginGroupingType: "REPCOUNTRY + UNK + OTHER"
    }
  });

  // 5. Apply origin grouping
  appManager.onShinyEvent({
    Type: "CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED",
    Status: "SUCCESS",
    Payload: null
  });

  // 6. Prepare summary data
  appManager.onShinyEvent({
    Type: "SUMMARY_DATA_PREPARED",
    Status: "SUCCESS",
    Payload: {
      DiagYearPlotData: {
        filter: { "scaleMinYear": 2000, "scaleMaxYear": 2014, "valueMinYear": 2000, "valueMaxYear": 2014, "applyInAdjustments": false },
        chartCategories: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
        chartData: [
          { "name": "Female", "data": [1230, 149, 206, 245, 260, 290, 233, 211, 212, 201, 168, 147, 139, 108, 25] },
          { "name": "Male", "data": [183, 235, 269, 324, 358, 359, 376, 406, 386, 373, 387, 398, 398, 381, 80] }
        ]
      },
      NotifQuarterPlotData: {
        filter: { "scaleMinYear": 2000.25, "scaleMaxYear": 2015, "valueMinYear": 2000.25, "valueMaxYear": 2015, "applyInAdjustments": false },
        chartCategories: [2000.25, 2000.5, 2000.75, 2001, 2001.25, 2001.5, 2001.75, 2002, 2002.25, 2002.5, 2002.75, 2003, 2003.25, 2003.5, 2003.75, 2004, 2004.25, 2004.5, 2004.75, 2005, 2005.25, 2005.5, 2005.75, 2006, 2006.25, 2006.5, 2006.75, 2007, 2007.25, 2007.5, 2007.75, 2008, 2008.25, 2008.5, 2008.75, 2009, 2009.25, 2009.5, 2009.75, 2010, 2010.25, 2010.5, 2010.75, 2011, 2011.25, 2011.5, 2011.75, 2012, 2012.25, 2012.5, 2012.75, 2013, 2013.25, 2013.5, 2013.75, 2014, 2014.25, 2014.5, 2014.75, 2015],
        chartData: [
          { "name": "Female", "data": [7, 17, 21, 17, 26, 37, 31, 27, 48, 42, 49, 54, 58, 56, 45, 56, 48, 51, 43, 58, 80, 85, 78, 44, 87, 60, 51, 65, 55, 53, 31, 35, 70, 43, 65, 56, 103, 20, 89, 29, 48, 41, 82, 22, 53, 17, 65, 9, 60, 13, 81, 4, 62, 11, 49, 16, 7, 40, 25, 11] },
          { "name": "Male", "data": [16, 46, 29, 36, 45, 44, 45, 37, 62, 64, 70, 49, 81, 67, 72, 88, 58, 82, 73, 93, 108, 120, 101, 64, 91, 93, 82, 110, 84, 90, 72, 67, 114, 84, 117, 81, 135, 52, 143, 52, 128, 57, 159, 42, 129, 58, 152, 33, 158, 30, 184, 12, 208, 29, 201, 46, 43, 146, 59, 22] }
        ]
      },
      MissPlotData: {
        selected: 'all',
        plot1: {
          chartCategories: ['CD4', 'Migrant', 'Transmission', 'Age'],
          chartData: {
            all: [0.25234234, 0.23, 0.19, 0.12],
            female: [0.35, 0.23, 0.19, 0.2],
            male: [0.45, 0.23, 0.19, 0.1]
          }
        },
        plot2: {
          chartCategories: ['CD4', 'Migrant', 'Transmission', 'Age'],
          chartData: {
            all: [[1, 1, 1, 1], [0, 1, 0, 1], [1, 0, 1, 1], [1, 0, 0, 0]],
            female: [[1, 1, 1, 1], [0, 1, 0, 1], [1, 0, 1, 1]],
            male: [[1, 1, 1, 1], [0, 1, 0, 1]]
          }
        },
        plot3: {
          chartData: {
            all: [{ name: 'Missing', y: 0.03 }, { name: 'Missing', y: 0.07 }, { name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }],
            female: [{ name: 'Missing', y: 0.07 }, { name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }],
            male: [{ name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }]
          },
        },
        plot4: {
          chartCategories: [1999, 2000, 2001, 2002, 2003],
          chartData: {
            all: [
              { name: 'CD4', data: [0.223423434, 0.3, 0.5, 0.2, 0.4] },
              { name: 'Migrant', data: [0.4, 0.1, 0.09, 0.1, 0.7] },
              { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.12, 0.44] },
              { name: 'Age', data: [0.5, 0.2, 0.55, 0.6, 0.34] }
            ],
            female: [
              { name: 'CD4', data: [0.2, 0.3, 0.3, 0.2, 0.4] },
              { name: 'Migrant', data: [0.5, 0.1, 0.09, 0.1, 0.7] },
              { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.32, 0.44] },
              { name: 'Age', data: [0.5, 0.2, 0.55, 0.6, 0.34] }
            ],
            male: [
              { name: 'CD4', data: [0.2, 0.3, 0.5, 0.2, 0.4] },
              { name: 'Migrant', data: [0.6, 0.1, 0.09, 0.1, 0.6] },
              { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.12, 0.44] },
              { name: 'Age', data: [0.5, 0.2, 0.45, 0.5, 0.34] }
            ],
          }
        }
      }
    }
  });

};

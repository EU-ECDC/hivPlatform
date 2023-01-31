import { DEBUG } from './settings';
import {
  // AdjustmentsReport, AdjustmentsRunLog, ReportingDelaysChartData, HIVPlotData, MigrantStats,
  UIState
} from './initData';

export default appMgr => {
  if (!DEBUG) return;

  appMgr.setShinyState('DEBUGGING');

  appMgr.onShinyEvent({
    type: 'PACKAGE_DETAILS_SENT',
    payload: {
      ActionStatus: 'SUCCESS',
      PackageDetails: {
        Name: 'hivPlatform',
        Title: 'HIV Platform',
        Version: '3.0.0',
        Date: '2022-12-22',
        Description: 'Improves the accuracy of HIV estimates in EU/EEA countries.'
      }
    }
  });

  // appMgr.onShinyEvent({
  //   type: 'STATE_LOADED',
  //   payload: {
  //     ActionStatus: 'SUCCESS',
  //     UIState: UIState
  //   }
  // });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: 'SESSION_INITIALIZED'
    }
  });

  // 1. Upload case-based data
  appMgr.onShinyEvent({
    type: 'CASE_BASED_DATA_UPLOADED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Data has been uploaded successfully',
      FileName: 'asd',
      FilePath: 'asds',
      FileSize: 4000,
      FileType: 'asdas'
    }
  });

  // 2. Upload case-based data
  appMgr.onShinyEvent({
    type: 'CASE_BASED_DATA_READ',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Data read correctly',
      ColumnNames: ['recordid', 'reportingcountry', 'age', 'gender'],
      RecordCount: 400,
      AttrMapping: [
        { attribute: 'RecordId', origColName: 'recordid', defaultValue: null, type: 'character' },
        { attribute: 'ReportingCountry', origColName: 'reportingcountry', defaultValue: null, type: 'character' },
        { attribute: 'Age', origColName: 'age', defaultValue: null, type: 'numeric' },
        { attribute: 'Gender', origColName: 'gender', defaultValue: null, type: 'character' },
        { attribute: 'DateOfArt', origColName: null, defaultValue: null, type: 'date' }
      ]
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: ['SESSION_INITIALIZED', 'CASE_BASED_READ']
    }
  });

  appMgr.onShinyEvent({
    type: 'AGGR_DATA_UPLOADED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'asd asd',
      FileName: 'asdasd',
      FilePath: 'asdd ads',
      FileSize: 7000,
      FileType: 'asdas asd'
    }
  });

  // 2b. Upload aggregated data
  appMgr.onShinyEvent({
    type: 'AGGR_DATA_READ',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'asd asd',
      DataFiles: [
        { name: 'Dead', use: true, years: [1980, 2015] },
        { name: 'AIDS', use: true, years: [1980, 2017] },
        { name: 'HIV, HIVAIDS', use: true, years: [1992, 2013] },
        { name: 'HIV_CD4_1, HIV_CD4_2, HIV_CD4_3, HIV_CD4_4', use: true, years: [1992, 2013] },
      ],
      PopulationNames: ['pop_0', 'pop_1'],
      RangeYears: [1980, 2017]
    }
  });

  appMgr.onShinyEvent({
    type: 'MODELS_YEAR_RANGES_DETERMINED',
    payload: {
      ActionStatus: "SUCCESS",
      ActionMessage: "Alllowed parameters determined",
      Years: {
        Range: {
          AIDS: [1980, 2016],
          Dead: [1980, 2017],
          HIV: [1980, 2016],
          HIV_CD4_1: [1980, 2016],
          HIV_CD4_2: [1980, 2016],
          HIV_CD4_3: [1980, 2016],
          HIV_CD4_4: [1980, 2016],
          HIVAIDS: [1985, 2016]
        },
        Optimal: {
          All: [1980, 2016],
          HIVCD4: [1984, 2016],
          HIV: [1979, 1979],
          AIDS: [1980, 1995],
          HIVAIDS: [1985, 2016]
        }
      }
    }
  });

  appMgr.onShinyEvent({
    type: 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Attributes applied correctly',
      OriginDistribution: {
        FullRegionOfOrigin: [
          'REPCOUNTRY', 'SUBAFR', 'WESTEUR', 'SOUTHASIA', 'CENTEUR', 'CAR', 'LATAM', 'EASTEUR',
          'NORTHAM', 'NORTHAFRMIDEAST', 'EASTASIAPAC', 'AUSTNZ', 'UNK'
        ],
        Count: [1562, 2237, 1119, 164, 144, 123, 107, 58, 49, 43, 36, 33, 1944]
      },
      OriginGroupingPreset: 'REPCOUNTRY + UNK + OTHER',
      OriginGrouping: [
        {
          GroupedRegionOfOrigin: 'UNK',
          FullRegionOfOrigin: 'UNK',
          MigrantRegionOfOrigin: null
        },
        {
          GroupedRegionOfOrigin: 'OTHER',
          FullRegionOfOrigin: [
            'ABROAD', 'AUSTNZ', 'CAR', 'CENTEUR', 'EASTASIAPAC', 'EASTEUR', 'EUROPE', 'LATAM',
            'NORTHAFRMIDEAST', 'NORTHAM', 'SOUTHASIA', 'SUBAFR', 'WESTEUR'
          ],
          MigrantRegionOfOrigin: null
        },
        {
          GroupedRegionOfOrigin: 'REPCOUNTRY',
          FullRegionOfOrigin: 'REPCOUNTRY',
          MigrantRegionOfOrigin: null
        }
      ]
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: ['SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING']
    }
  });

  appMgr.onShinyEvent({
    type: 'CASE_BASED_DATA_ORIGIN_GROUPING_MIGRANT_CHECKED',
    payload: {
      ActionStatus: true,
      ActionMessage: 'Preset is compatible with the migration module'
    }
  });

  // 4. Set origin grouping
  appMgr.onShinyEvent({
    type: 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Migrant variable regrouping applied correctly',
      Summary: {
        'DiagYearPlotData': {
          'filter': {
            'scaleMinYear': 1985,
            'scaleMaxYear': 2015,
            'valueMinYear': 1985,
            'valueMaxYear': 2015,
            'applyInAdjustments': false
          },
          'chartCategories': [1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
          'chartData': [
            {
              'name': 'Male',
              'data': [38, 42, 30, 34, 28, 92, 70, 134, 131, 140, 162, 208, 224, 231, 198, 273, 283, 303, 333, 376, 327, 342, 401, 466, 459, 497, 601, 576, 646, 618, 571]
            },
            {
              'name': 'Female',
              'data': [11, 15, 12, 6, 13, 48, 37, 45, 67, 72, 85, 72, 118, 108, 146, 174, 160, 130, 157, 154, 175, 110, 112, 117, 133, 124, 143, 158, 125, 132, 154]
            }
          ]
        },
        'NotifQuarterPlotData': {
          'filter': {
            'scaleMinYear': 1985.125,
            'scaleMaxYear': 2016.375,
            'valueMinYear': 1985.125,
            'valueMaxYear': 2016.375,
            'applyInAdjustments': false
          },
          'chartCategories': [1985.125, 1985.375, 1985.625, 1985.875, 1986.125, 1986.375, 1986.625, 1986.875, 1987.125, 1987.375, 1987.625, 1987.875, 1988.125, 1988.375, 1988.625, 1988.875, 1989.125, 1989.375, 1989.625, 1989.875, 1990.125, 1990.375, 1990.625, 1990.875, 1991.125, 1991.375, 1991.625, 1991.875, 1992.125, 1992.375, 1992.625, 1992.875, 1993.125, 1993.375, 1993.625, 1993.875, 1994.125, 1994.375, 1994.625, 1994.875, 1995.125, 1995.375, 1995.625, 1995.875, 1996.125, 1996.375, 1996.625, 1996.875, 1997.125, 1997.375, 1997.625, 1997.875, 1998.125, 1998.375, 1998.625, 1998.875, 1999.125, 1999.375, 1999.625, 1999.875, 2000.125, 2000.375, 2000.625, 2000.875, 2001.125, 2001.375, 2001.625, 2001.875, 2002.125, 2002.375, 2002.625, 2002.875, 2003.125, 2003.375, 2003.625, 2003.875, 2004.125, 2004.375, 2004.625, 2004.875, 2005.125, 2005.375, 2005.625, 2005.875, 2006.125, 2006.375, 2006.625, 2006.875, 2007.125, 2007.375, 2007.625, 2007.875, 2008.125, 2008.375, 2008.625, 2008.875, 2009.125, 2009.375, 2009.625, 2009.875, 2010.125, 2010.375, 2010.625, 2010.875, 2011.125, 2011.375, 2011.625, 2011.875, 2012.125, 2012.375, 2012.625, 2012.875, 2013.125, 2013.375, 2013.625, 2013.875, 2014.125, 2014.375, 2014.625, 2014.875, 2015.125, 2015.375, 2015.625, 2015.875, 2016.125, 2016.375], 'chartData': [{ 'name': 'Male', 'data': [4, 11, 10, 10, 17, 8, 11, 4, 10, 8, 4, 3, 10, 12, 6, 3, 7, 3, 5, 7, 38, 16, 13, 11, 17, 15, 14, 6, 37, 25, 22, 24, 31, 29, 24, 24, 39, 26, 19, 18, 33, 22, 26, 26, 29, 38, 34, 32, 52, 32, 37, 44, 40, 54, 107, 114, 82, 68, 73, 50, 63, 55, 50, 57, 58, 61, 63, 56, 89, 129, 98, 133, 109, 88, 72, 102, 94, 88, 97, 98, 96, 73, 79, 87, 110, 93, 78, 72, 110, 96, 91, 101, 123, 128, 107, 100, 109, 115, 113, 132, 127, 110, 123, 127, 147, 126, 148, 182, 159, 160, 139, 137, 154, 157, 172, 159, 177, 150, 152, 151, 157, 148, 161, 127, 17, 2] }, { 'name': 'Female', 'data': [1, 0, 4, 6, 5, 9, 1, 0, 5, 2, 3, 2, 3, 1, 1, 0, 4, 3, 3, 2, 23, 13, 6, 5, 15, 9, 6, 7, 16, 12, 9, 7, 22, 18, 11, 11, 26, 21, 5, 14, 20, 18, 13, 18, 14, 17, 15, 18, 20, 23, 31, 21, 28, 22, 32, 33, 43, 28, 47, 37, 42, 28, 30, 40, 36, 30, 29, 36, 33, 67, 58, 45, 40, 40, 42, 51, 52, 23, 38, 38, 40, 50, 41, 44, 32, 27, 31, 28, 36, 26, 17, 30, 34, 18, 40, 27, 26, 28, 41, 41, 24, 40, 30, 27, 38, 38, 32, 40, 44, 47, 31, 36, 40, 41, 24, 22, 37, 34, 28, 35, 39, 40, 39, 37, 5, 2] }]
        }
      },
      MigrantCompatibility: {
        Valid: true
      }
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING'
      ]
    }
  });

  // 4. Set origin grouping
  appMgr.onShinyEvent({
    type: 'CASE_BASED_SUMMARY_DATA_PREPARED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Summary prepared',
      Summary: {
        SelectedCount: 4345,
        TotalCount: 7168,
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
              all: [
                [0, 0, 1], [0, 1, 0], [0, 2, 1], [0, 3, 1],
                [1, 0, 1], [1, 1, 1], [1, 2, 0], [1, 3, 0],
                [2, 0, 1], [2, 1, 0], [2, 2, 1], [2, 3, 0],
                [3, 0, 1], [3, 1, 1], [3, 2, 1], [3, 3, 0],
              ],
              female: [
                [0, 0, 1], [0, 1, 0], [0, 2, 1],
                [1, 0, 1], [1, 1, 1], [1, 2, 0],
                [2, 0, 1], [2, 1, 0], [2, 2, 1],
                [3, 0, 1], [3, 1, 1], [3, 2, 1],
              ],
              male: [
                [0, 0, 1], [0, 1, 0],
                [1, 0, 1], [1, 1, 1],
                [2, 0, 1], [2, 1, 0],
                [3, 0, 1], [3, 1, 1],
              ]
            }
          },
          plot3: {
            chartData: {
              all: [
                { name: 'Present', y: 0.2622 },
                { name: 'Missing', y: 0.14 },
                { name: 'Missing', y: 0.07 },
                { name: 'Missing', y: 0.03 },
              ],
              female: [
                { name: 'Present', y: 0.2622 },
                { name: 'Missing', y: 0.14 },
                { name: 'Missing', y: 0.07 }
              ],
              male: [
                { name: 'Present', y: 0.2622 },
                { name: 'Missing', y: 0.14 },
              ]
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
        },
        RepDelPlotData: {
          chartData: ReportingDelaysChartData
        }
      }
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY'
      ]
    }
  });

  appMgr.onShinyEvent({
    type: 'ADJUSTMENTS_RUN_LOG_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      RunLog: AdjustmentsRunLog
    }
  });

  // 4. Set origin grouping
  appMgr.onShinyEvent({
    type: 'ADJUSTMENTS_RUN_FINISHED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Running adjustment task finished',
      AdjustmentsReport: AdjustmentsReport,
      RunAdjustmentsTypes: ['MULTIPLE_IMPUTATIONS', 'REPORTING_DELAYS']
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS'
      ]
    }
  });


  appMgr.onShinyEvent({
    type: 'MIGRATION_RUN_FINISHED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Migration task finished',
      ...MigrantStats
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_ADJUSTMENTS', 'CASE_BASED_MIGRATION'
      ]
    }
  });

  appMgr.onShinyEvent({
    type: 'CREATING_REPORT_FINISHED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Running report task finished',
      Report: 'Test report'
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS',
        'CASE_BASED_MIGRATION', 'REPORTS'
      ]
    }
  });

  // 8. Available strata set
  appMgr.onShinyEvent({
    type: 'AVAILABLE_STRATA_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      AvailableVariables: [
        { 'Name': 'Gender', 'Code': 'G' },
        { 'Name': 'Transmission', 'Code': 'T' },
        { 'Name': 'GroupedRegionOfOrigin', 'Code': 'O' },
        { 'Name': 'PlaceOfResidence', 'Code': 'R' }
      ],
      AvailableStrata: {
        'Gender': [
          { 'Combination': 'F [G]', 'Count': 2706, 'Perc': 0.3552 },
          { 'Combination': 'M [G]', 'Count': 4913, 'Perc': 0.6448 }
        ],
        'Transmission': [
          { 'Combination': 'HETERO [T]', 'Count': 3368, 'Perc': 0.4421 },
          { 'Combination': 'IDU [T]', 'Count': 144, 'Perc': 0.0189 },
          { 'Combination': 'MSM [T]', 'Count': 2526, 'Perc': 0.3315 },
          { 'Combination': 'NA [T]', 'Count': 1581, 'Perc': 0.2075 }
        ],
        'GroupedRegionOfOrigin': [
          { 'Combination': 'NA [O]', 'Count': 1944, 'Perc': 0.2552 },
          { 'Combination': 'OTHER [O]', 'Count': 4113, 'Perc': 0.5398 },
          { 'Combination': 'REPCOUNTRY [O]', 'Count': 1562, 'Perc': 0.205 }
        ],
        'PlaceOfResidence': [
          { 'Combination': 'NA [R]', 'Count': 7619, 'Perc': 1 }
        ],
        'Gender, Transmission': [
          { 'Combination': 'F [G], HETERO [T]', 'Count': 2092, 'Perc': 0.2746 },
          { 'Combination': 'F [G], IDU [T]', 'Count': 36, 'Perc': 0.0047 },
          { 'Combination': 'F [G], NA [T]', 'Count': 578, 'Perc': 0.0759 },
          { 'Combination': 'M [G], HETERO [T]', 'Count': 1276, 'Perc': 0.1675 },
          { 'Combination': 'M [G], IDU [T]', 'Count': 108, 'Perc': 0.0142 },
          { 'Combination': 'M [G], MSM [T]', 'Count': 2526, 'Perc': 0.3315 },
          { 'Combination': 'M [G], NA [T]', 'Count': 1003, 'Perc': 0.1316 }
        ],
        'Gender, GroupedRegionOfOrigin': [
          { 'Combination': 'F [G], NA [O]', 'Count': 708, 'Perc': 0.0929 },
          { 'Combination': 'F [G], OTHER [O]', 'Count': 1775, 'Perc': 0.233 },
          { 'Combination': 'F [G], REPCOUNTRY [O]', 'Count': 223, 'Perc': 0.0293 },
          { 'Combination': 'M [G], NA [O]', 'Count': 1236, 'Perc': 0.1622 },
          { 'Combination': 'M [G], OTHER [O]', 'Count': 2338, 'Perc': 0.3069 },
          { 'Combination': 'M [G], REPCOUNTRY [O]', 'Count': 1339, 'Perc': 0.1757 }
        ],
        'Gender, PlaceOfResidence': [
          { 'Combination': 'F [G], NA [R]', 'Count': 2706, 'Perc': 0.3552 },
          { 'Combination': 'M [G], NA [R]', 'Count': 4913, 'Perc': 0.6448 }
        ],
        'Transmission, GroupedRegionOfOrigin': [
          { 'Combination': 'HETERO [T], NA [O]', 'Count': 868, 'Perc': 0.1139 },
          { 'Combination': 'HETERO [T], OTHER [O]', 'Count': 2179, 'Perc': 0.286 },
          { 'Combination': 'HETERO [T], REPCOUNTRY [O]', 'Count': 321, 'Perc': 0.0421 },
          { 'Combination': 'IDU [T], NA [O]', 'Count': 42, 'Perc': 0.0055 },
          { 'Combination': 'IDU [T], OTHER [O]', 'Count': 69, 'Perc': 0.0091 },
          { 'Combination': 'IDU [T], REPCOUNTRY [O]', 'Count': 33, 'Perc': 0.0043 },
          { 'Combination': 'MSM [T], NA [O]', 'Count': 634, 'Perc': 0.0832 },
          { 'Combination': 'MSM [T], OTHER [O]', 'Count': 1017, 'Perc': 0.1335 },
          { 'Combination': 'MSM [T], REPCOUNTRY [O]', 'Count': 875, 'Perc': 0.1148 },
          { 'Combination': 'NA [T], NA [O]', 'Count': 400, 'Perc': 0.0525 },
          { 'Combination': 'NA [T], OTHER [O]', 'Count': 848, 'Perc': 0.1113 },
          { 'Combination': 'NA [T], REPCOUNTRY [O]', 'Count': 333, 'Perc': 0.0437 }
        ],
        'Transmission, PlaceOfResidence': [
          { 'Combination': 'HETERO [T], NA [R]', 'Count': 3368, 'Perc': 0.4421 },
          { 'Combination': 'IDU [T], NA [R]', 'Count': 144, 'Perc': 0.0189 },
          { 'Combination': 'MSM [T], NA [R]', 'Count': 2526, 'Perc': 0.3315 },
          { 'Combination': 'NA [T], NA [R]', 'Count': 1581, 'Perc': 0.2075 }
        ],
        'GroupedRegionOfOrigin, PlaceOfResidence': [
          { 'Combination': 'NA [O], NA [R]', 'Count': 1944, 'Perc': 0.2552 },
          { 'Combination': 'OTHER [O], NA [R]', 'Count': 4113, 'Perc': 0.5398 },
          { 'Combination': 'REPCOUNTRY [O], NA [R]', 'Count': 1562, 'Perc': 0.205 }
        ],
        'Gender, Transmission, GroupedRegionOfOrigin': [
          { 'Combination': 'F [G], HETERO [T], NA [O]', 'Count': 545, 'Perc': 0.0715 },
          { 'Combination': 'F [G], HETERO [T], OTHER [O]', 'Count': 1389, 'Perc': 0.1823 },
          { 'Combination': 'F [G], HETERO [T], REPCOUNTRY [O]', 'Count': 158, 'Perc': 0.0207 },
          { 'Combination': 'F [G], IDU [T], NA [O]', 'Count': 9, 'Perc': 0.0012 },
          { 'Combination': 'F [G], IDU [T], OTHER [O]', 'Count': 18, 'Perc': 0.0024 },
          { 'Combination': 'F [G], IDU [T], REPCOUNTRY [O]', 'Count': 9, 'Perc': 0.0012 },
          { 'Combination': 'F [G], NA [T], NA [O]', 'Count': 154, 'Perc': 0.0202 },
          { 'Combination': 'F [G], NA [T], OTHER [O]', 'Count': 368, 'Perc': 0.0483 },
          { 'Combination': 'F [G], NA [T], REPCOUNTRY [O]', 'Count': 56, 'Perc': 0.0074 },
          { 'Combination': 'M [G], HETERO [T], NA [O]', 'Count': 323, 'Perc': 0.0424 },
          { 'Combination': 'M [G], HETERO [T], OTHER [O]', 'Count': 790, 'Perc': 0.1037 },
          { 'Combination': 'M [G], HETERO [T], REPCOUNTRY [O]', 'Count': 163, 'Perc': 0.0214 },
          { 'Combination': 'M [G], IDU [T], NA [O]', 'Count': 33, 'Perc': 0.0043 },
          { 'Combination': 'M [G], IDU [T], OTHER [O]', 'Count': 51, 'Perc': 0.0067 },
          { 'Combination': 'M [G], IDU [T], REPCOUNTRY [O]', 'Count': 24, 'Perc': 0.0032 },
          { 'Combination': 'M [G], MSM [T], NA [O]', 'Count': 634, 'Perc': 0.0832 },
          { 'Combination': 'M [G], MSM [T], OTHER [O]', 'Count': 1017, 'Perc': 0.1335 },
          { 'Combination': 'M [G], MSM [T], REPCOUNTRY [O]', 'Count': 875, 'Perc': 0.1148 },
          { 'Combination': 'M [G], NA [T], NA [O]', 'Count': 246, 'Perc': 0.0323 },
          { 'Combination': 'M [G], NA [T], OTHER [O]', 'Count': 480, 'Perc': 0.063 },
          { 'Combination': 'M [G], NA [T], REPCOUNTRY [O]', 'Count': 277, 'Perc': 0.0364 }
        ],
        'Gender, Transmission, PlaceOfResidence': [
          { 'Combination': 'F [G], HETERO [T], NA [R]', 'Count': 2092, 'Perc': 0.2746 },
          { 'Combination': 'F [G], IDU [T], NA [R]', 'Count': 36, 'Perc': 0.0047 },
          { 'Combination': 'F [G], NA [T], NA [R]', 'Count': 578, 'Perc': 0.0759 },
          { 'Combination': 'M [G], HETERO [T], NA [R]', 'Count': 1276, 'Perc': 0.1675 },
          { 'Combination': 'M [G], IDU [T], NA [R]', 'Count': 108, 'Perc': 0.0142 },
          { 'Combination': 'M [G], MSM [T], NA [R]', 'Count': 2526, 'Perc': 0.3315 },
          { 'Combination': 'M [G], NA [T], NA [R]', 'Count': 1003, 'Perc': 0.1316 }
        ],
        'Gender, GroupedRegionOfOrigin, PlaceOfResidence': [
          { 'Combination': 'F [G], NA [O], NA [R]', 'Count': 708, 'Perc': 0.0929 },
          { 'Combination': 'F [G], OTHER [O], NA [R]', 'Count': 1775, 'Perc': 0.233 },
          { 'Combination': 'F [G], REPCOUNTRY [O], NA [R]', 'Count': 223, 'Perc': 0.0293 },
          { 'Combination': 'M [G], NA [O], NA [R]', 'Count': 1236, 'Perc': 0.1622 },
          { 'Combination': 'M [G], OTHER [O], NA [R]', 'Count': 2338, 'Perc': 0.3069 },
          { 'Combination': 'M [G], REPCOUNTRY [O], NA [R]', 'Count': 1339, 'Perc': 0.1757 }
        ],
        'Transmission, GroupedRegionOfOrigin, PlaceOfResidence': [
          { 'Combination': 'HETERO [T], NA [O], NA [R]', 'Count': 868, 'Perc': 0.1139 },
          { 'Combination': 'HETERO [T], OTHER [O], NA [R]', 'Count': 2179, 'Perc': 0.286 },
          { 'Combination': 'HETERO [T], REPCOUNTRY [O], NA [R]', 'Count': 321, 'Perc': 0.0421 },
          { 'Combination': 'IDU [T], NA [O], NA [R]', 'Count': 42, 'Perc': 0.0055 },
          { 'Combination': 'IDU [T], OTHER [O], NA [R]', 'Count': 69, 'Perc': 0.0091 },
          { 'Combination': 'IDU [T], REPCOUNTRY [O], NA [R]', 'Count': 33, 'Perc': 0.0043 },
          { 'Combination': 'MSM [T], NA [O], NA [R]', 'Count': 634, 'Perc': 0.0832 },
          { 'Combination': 'MSM [T], OTHER [O], NA [R]', 'Count': 1017, 'Perc': 0.1335 },
          { 'Combination': 'MSM [T], REPCOUNTRY [O], NA [R]', 'Count': 875, 'Perc': 0.1148 },
          { 'Combination': 'NA [T], NA [O], NA [R]', 'Count': 400, 'Perc': 0.0525 },
          { 'Combination': 'NA [T], OTHER [O], NA [R]', 'Count': 848, 'Perc': 0.1113 },
          { 'Combination': 'NA [T], REPCOUNTRY [O], NA [R]', 'Count': 333, 'Perc': 0.0437 }
        ],
        'Gender, Transmission, GroupedRegionOfOrigin, PlaceOfResidence': [
          { 'Combination': 'F [G], HETERO [T], NA [O], NA [R]', 'Count': 545, 'Perc': 0.0715 },
          { 'Combination': 'F [G], HETERO [T], OTHER [O], NA [R]', 'Count': 1389, 'Perc': 0.1823 },
          { 'Combination': 'F [G], HETERO [T], REPCOUNTRY [O], NA [R]', 'Count': 158, 'Perc': 0.0207 },
          { 'Combination': 'F [G], IDU [T], NA [O], NA [R]', 'Count': 9, 'Perc': 0.0012 },
          { 'Combination': 'F [G], IDU [T], OTHER [O], NA [R]', 'Count': 18, 'Perc': 0.0024 },
          { 'Combination': 'F [G], IDU [T], REPCOUNTRY [O], NA [R]', 'Count': 9, 'Perc': 0.0012 },
          { 'Combination': 'F [G], NA [T], NA [O], NA [R]', 'Count': 154, 'Perc': 0.0202 },
          { 'Combination': 'F [G], NA [T], OTHER [O], NA [R]', 'Count': 368, 'Perc': 0.0483 },
          { 'Combination': 'F [G], NA [T], REPCOUNTRY [O], NA [R]', 'Count': 56, 'Perc': 0.0074 },
          { 'Combination': 'M [G], HETERO [T], NA [O], NA [R]', 'Count': 323, 'Perc': 0.0424 },
          { 'Combination': 'M [G], HETERO [T], OTHER [O], NA [R]', 'Count': 790, 'Perc': 0.1037 },
          { 'Combination': 'M [G], HETERO [T], REPCOUNTRY [O], NA [R]', 'Count': 163, 'Perc': 0.0214 },
          { 'Combination': 'M [G], IDU [T], NA [O], NA [R]', 'Count': 33, 'Perc': 0.0043 },
          { 'Combination': 'M [G], IDU [T], OTHER [O], NA [R]', 'Count': 51, 'Perc': 0.0067 },
          { 'Combination': 'M [G], IDU [T], REPCOUNTRY [O], NA [R]', 'Count': 24, 'Perc': 0.0032 },
          { 'Combination': 'M [G], MSM [T], NA [O], NA [R]', 'Count': 634, 'Perc': 0.0832 },
          { 'Combination': 'M [G], MSM [T], OTHER [O], NA [R]', 'Count': 1017, 'Perc': 0.1335 },
          { 'Combination': 'M [G], MSM [T], REPCOUNTRY [O], NA [R]', 'Count': 875, 'Perc': 0.1148 },
          { 'Combination': 'M [G], NA [T], NA [O], NA [R]', 'Count': 246, 'Perc': 0.0323 },
          { 'Combination': 'M [G], NA [T], OTHER [O], NA [R]', 'Count': 480, 'Perc': 0.063 },
          { 'Combination': 'M [G], NA [T], REPCOUNTRY [O], NA [R]', 'Count': 277, 'Perc': 0.0364 }
        ]
      }
    }
  });

  // 9. Read model parameters
  appMgr.onShinyEvent({
    type: 'MODELS_PARAMS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      Params: {
        'minYear': 1980,
        'maxYear': 2016,
        'minFitPos': 1979,
        'maxFitPos': 1979,
        'minFitCD4': 1984,
        'maxFitCD4': 2016,
        'minFitAIDS': 1984,
        'maxFitAIDS': 1995,
        'minFitHIVAIDS': 1996,
        'maxFitHIVAIDS': 2016,
        'country': 'NL',
        'knotsCount': 6,
        'startIncZero': true,
        'distributionFit': 'NEGATIVE_BINOMIAL',
        'rDisp': 50,
        'delta4Fac': 0,
        'maxIncCorr': true,
        'splineType': 'B-SPLINE',
        'fullData': true,
        'timeIntervals': [
          { 'startYear': 1980, 'jump': false, 'changeInInterval': false, 'diffByCD4': false, 'endYear': 1984 },
          { 'startYear': 1984, 'jump': true,  'changeInInterval': false, 'diffByCD4': false, 'endYear': 1996 },
          { 'startYear': 1996, 'jump': false, 'changeInInterval': false, 'diffByCD4': false, 'endYear': 2000 },
          { 'startYear': 2000, 'jump': false, 'changeInInterval': false, 'diffByCD4': false, 'endYear': 2005 },
          { 'startYear': 2005, 'jump': false, 'changeInInterval': false, 'diffByCD4': false, 'endYear': 2010 },
          { 'startYear': 2010, 'jump': false, 'changeInInterval': false, 'diffByCD4': false, 'endYear': 2016 }
        ]
      }
    }
  });
  appMgr.modelMgr.setModelsParamFileName('Partial data model.xml');

  // 10. Model run log set
  appMgr.onShinyEvent({
    type: 'MODELS_RUN_LOG_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      RunLog: `<span style='color: #00BBBB;'>--</span><span> </span><span style='font-weight: bold;'>1. Context</span>`
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS',
        'CASE_BASED_MIGRATION', 'REPORTS', 'AGGR_READ', 'MODELLING'
      ]
    }
  });

  // 10. Model run log set
  appMgr.onShinyEvent({
    type: 'BOOTSTRAP_RUN_FINISHED',
    payload: {
      ActionStatus: 'SUCCESS',
      ActionMessage: 'Running HIV Model bootstrap fit task finished',
      PlotData: HIVPlotData
    }
  });

  appMgr.onShinyEvent({
    type: 'COMPLETED_STEPS_SET',
    payload: {
      ActionStatus: 'SUCCESS',
      CompletedSteps: [
        'SESSION_INITIALIZED', 'CASE_BASED_READ', 'CASE_BASED_ATTR_MAPPING',
        'CASE_BASED_ORIGIN_GROUPING', 'CASE_BASED_SUMMARY', 'CASE_BASED_ADJUSTMENTS',
        'CASE_BASED_MIGRATION', 'REPORTS', 'AGGR_READ', 'MODELLING', 'BOOTSTRAP'
      ]
    }
  });

  appMgr.uiStateMgr.setActivePageId(0, 0);
  appMgr.caseBasedDataMgr.setUploadProgress(0.6);
  appMgr.aggrDataMgr.setFileUploadProgress(0.6);
  appMgr.adjustMgr.setAdjustmentsRunProgress(true);
  appMgr.modelMgr.setModelsRunProgress(true);
  appMgr.modelMgr.setBootstrapRunProgress(true);
  appMgr.reportMgr.setCreatingReportInProgress(true);

};

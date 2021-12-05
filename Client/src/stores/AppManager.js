import { observable, action, configure, computed, toJS, makeObservable } from 'mobx';
import { createModelSchema, serialize, identifier, primitive, reference, list, raw, map, object } from 'serializr';
import UIStateManager from './UIStateManager'
import NotificationsManager from './NotificationsManager';
import AttrMappingManager from './AttrMappingManager';
import OriginGroupingsManager from './OriginGroupingsManager';
import CaseBasedDataManager from './CaseBasedDataManager';
import AggrDataManager from './AggrDataManager';
import SummaryDataManager from './SummaryDataManager';
import AdjustmentsManager from './AdjustmentsManager';
import PopulationsManager from './PopulationsManager';
import PopCombinationsManager from './PopCombinationsManager';
import ModelsManager from './ModelsManager';
import ReportManager from './ReportManager';
import MigrationManager from './MigrationManager';
import IsNull from '../utilities/IsNull';
import EnsureArray from '../utilities/EnsureArray';
import FloatToQuarter from '../utilities/FloatToQuarter';
import SaveDataLocally from '../utilities/SaveDataLocally';

configure({
  enforceActions: 'observed',
  computedRequiresReaction: true,
});

export default class AppManager {

  id = 'AppManager';

  uiStateMgr = null;
  notificationsMgr = null;
  attrMappingMgr = null;
  origGroupMgr = null;
  caseBasedDataMgr = null;
  aggrDataMgr = null;
  summaryDataMgr = null;
  adjustMgr = null;
  popMgr = null;
  popCombMgr = null;
  modelMgr = null;
  reportMgr = null;
  migrMgr = null;

  shinyState = 'DISCONNECTED';

  shinyMessage = {};

  seed = null;

  // Shiny custom event handlers
  onShinyEvent = e => {
    console.log('onShinyEvent', e);
    switch (e.type) {
      case 'COMPLETED_STEPS_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.uiStateMgr.setCompletedSteps(e.payload.CompletedSteps);
        }
        break;
      case 'CASE_BASED_DATA_UPLOADED':
        this.caseBasedDataMgr.setActionStatus(e.payload.ActionStatus);
        this.caseBasedDataMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.caseBasedDataMgr.setFileName(e.payload.FileName);
          this.caseBasedDataMgr.setFilePath(e.payload.FilePath);
          this.caseBasedDataMgr.setFileSize(e.payload.FileSize);
          this.caseBasedDataMgr.setFileType(e.payload.FileType);
          this.uiStateMgr.setLastEventType(e.type);
        }
        break;
      case 'CASE_BASED_DATA_READ':
        this.caseBasedDataMgr.setActionStatus(e.payload.ActionStatus);
        this.caseBasedDataMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.caseBasedDataMgr.setColumnNames(e.payload.ColumnNames);
          this.caseBasedDataMgr.setRecordCount(e.payload.RecordCount);
          this.attrMappingMgr.setMapping(e.payload.AttrMapping);
          this.summaryDataMgr.reset();
          this.notificationsMgr.setMsg('Case-based data uploaded');
          this.uiStateMgr.setLastEventType(e.type);
        }
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.notificationsMgr.setMsg('Applying attribute mapping');
        }
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END':
        this.attrMappingMgr.setActionStatus(e.payload.ActionStatus);
        this.attrMappingMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.origGroupMgr.setDistribution(e.payload.OriginDistribution);
          this.origGroupMgr.setPreset(e.payload.OriginGroupingPreset);
          this.origGroupMgr.setGroupings(e.payload.OriginGrouping);
          this.notificationsMgr.setMsg('Attribute mapping has been applied');
          this.summaryDataMgr.reset();
          this.uiStateMgr.setLastEventType(e.type);
        } else {
          this.notificationsMgr.setMsg('Attribute mapping could not be applied');
          this.uiStateMgr.setLastEventType('CASE_BASED_DATA_READ');
        }
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_PREPARED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.origGroupMgr.setPreset(e.payload.OriginGroupingPreset);
          this.origGroupMgr.setGroupings(e.payload.OriginGrouping);
        } else {
          this.notificationsMgr.setMsg('There was a problem with setting this origin grouping');
        }
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_MIGRANT_CHECKED':
        this.origGroupMgr.setMigrantCompatibleStatus(e.payload.ActionStatus);
        this.origGroupMgr.setMigrantCompatibleMessage(e.payload.ActionMessage);
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED':
        this.origGroupMgr.setActionStatus(e.payload.ActionStatus);
        this.origGroupMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.summaryDataMgr.reset();
          this.summaryDataMgr.setDiagYearPlotData(e.payload.Summary.DiagYearPlotData);
          this.summaryDataMgr.setNotifQuarterPlotData(e.payload.Summary.NotifQuarterPlotData);
          this.adjustMgr.setRDWithoutStartYear(e.payload.Summary.DiagYearPlotData.filter.scaleMinYear);
          this.adjustMgr.setRDWithoutEndYear(Math.round(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
          this.adjustMgr.setRDWithoutEndQrt(FloatToQuarter(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
          this.adjustMgr.setRDWithStartYear(e.payload.Summary.DiagYearPlotData.filter.scaleMinYear);
          this.adjustMgr.setRDWithEndYear(Math.round(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
          this.adjustMgr.setRDWithEndQrt(FloatToQuarter(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
          this.adjustMgr.setDataBounds({
            startYear: e.payload.Summary.DiagYearPlotData.filter.scaleMinYear,
            endYear: Math.round(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear),
            endQrt: FloatToQuarter(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear)
          })
          this.migrMgr.setDataCompatibleFlag(e.payload.MigrantCompatibility.Valid);
          this.uiStateMgr.setLastEventType(e.type);
        } else {
          this.uiStateMgr.setLastEventType('CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END');
        }
        this.notificationsMgr.setMsg(e.payload.ActionMessage);
        break;
      case 'CASE_BASED_SUMMARY_DATA_PREPARED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.summaryDataMgr.setSelectedCount(e.payload.Summary.SelectedCount);
          this.summaryDataMgr.setTotalCount(e.payload.Summary.TotalCount);
          this.summaryDataMgr.setMissPlotData(e.payload.Summary.MissPlotData);
          this.summaryDataMgr.setRepDelPlotData(e.payload.Summary.RepDelPlotData);
        } else {
          this.notificationsMgr.setMsg(e.payload.ActionMessage);
        }
        break;
      case 'ADJUSTMENTS_RUN_STARTED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.adjustMgr.setAdjustmentsRunProgress(1);
          this.adjustMgr.setAdjustmentsReport(null);
        }
        break;
      case 'ADJUSTMENTS_RUN_LOG_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.adjustMgr.setAdjustmentsRunLog(e.payload.RunLog);
        }
        break;
      case 'ADJUSTMENTS_RUN_FINISHED':
        this.adjustMgr.setAdjustmentsRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.uiStateMgr.setLastEventType(e.type);
          this.adjustMgr.setAdjustmentsReport(e.payload.AdjustmentsReport);
          this.adjustMgr.setRunAdjustmentsTypes(e.payload.RunAdjustmentsTypes);
          this.notificationsMgr.setMsg('Adjustment run finished');
        } else {
          this.notificationsMgr.setMsg('Adjustment run failed');
        }
        break;
      case 'ADJUSTMENTS_RUN_CANCELLED':
        this.adjustMgr.setAdjustmentsRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.notificationsMgr.setMsg('Adjustment run cancelled');
        }
        break;
      case 'MIGRATION_RUN_STARTED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.migrMgr.setRunProgress(1);
          this.migrMgr.setStats(null);
        }
        break;
      case 'MIGRATION_RUN_LOG_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.migrMgr.setRunLog(e.payload.RunLog);
        }
        break;
      case 'MIGRATION_RUN_FINISHED':
        this.migrMgr.setRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.uiStateMgr.setLastEventType(e.type);
          console.log(e.payload.Stats);
          this.migrMgr.setStats(e.payload.Stats);
          this.notificationsMgr.setMsg('Migration run finished');
        } else {
          this.notificationsMgr.setMsg('Migration run failed');
        }
        break;
      case 'MIGRATION_RUN_CANCELLED':
        this.migrMgr.setRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.notificationsMgr.setMsg('Migration run cancelled');
        }
        break;
      case 'CREATING_REPORT_STARTED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.reportMgr.setCreatingReportInProgress(true);
          this.reportMgr.setReport(null);
          this.notificationsMgr.setMsg('Creating report started');
        }
        break;
      case 'CREATING_REPORT_FINISHED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.uiStateMgr.setLastEventType(e.type);
          this.reportMgr.setReport(e.payload.Report);
          this.notificationsMgr.setMsg('Creating report finished');
        } else {
          this.notificationsMgr.setMsg('Creating report failed');
        }
        this.reportMgr.setCreatingReportInProgress(false);
        break;
      case 'AGGR_DATA_UPLOADED':
        this.aggrDataMgr.setActionStatus(e.payload.ActionStatus);
        this.aggrDataMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.aggrDataMgr.setFileName(e.payload.FileName);
          this.aggrDataMgr.setFilePath(e.payload.FilePath);
          this.aggrDataMgr.setFileSize(e.payload.FileSize);
          this.aggrDataMgr.setFileType(e.payload.FileType);
        }
        break;
      case 'AGGR_DATA_READ':
        this.aggrDataMgr.setActionStatus(e.payload.ActionStatus);
        this.aggrDataMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.aggrDataMgr.setDataFiles(e.payload.DataFiles);
          this.aggrDataMgr.setPopulationNames(e.payload.PopulationNames);
          this.aggrDataMgr.setRangeYears(e.payload.RangeYears);
          this.notificationsMgr.setMsg('Aggregated data uploaded');
        }
        break;
      case 'AVAILABLE_STRATA_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.popMgr.setAvailableVariables(e.payload.AvailableVariables);
          this.popMgr.setAvailableStrata(e.payload.AvailableStrata);
        }
        break;
      case 'MODELS_PARAMS_LOADED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setMinYear(e.payload.Params.minYear);
          this.modelMgr.setMaxYear(e.payload.Params.maxYear);
          this.modelMgr.setMinFitPos(e.payload.Params.minFitPos);
          this.modelMgr.setMaxFitPos(e.payload.Params.maxFitPos);
          this.modelMgr.setMinFitCD4(e.payload.Params.minFitCD4);
          this.modelMgr.setMaxFitCD4(e.payload.Params.maxFitCD4);
          this.modelMgr.setMinFitAIDS(e.payload.Params.minFitAIDS);
          this.modelMgr.setMaxFitAIDS(e.payload.Params.maxFitAIDS);
          this.modelMgr.setMinFitHIVAIDS(e.payload.Params.minFitHIVAIDS);
          this.modelMgr.setMaxFitHIVAIDS(e.payload.Params.maxFitHIVAIDS);
          this.modelMgr.setFullData(e.payload.Params.fullData);
          this.modelMgr.setKnotsCount(e.payload.Params.knotsCount);
          this.modelMgr.setStartIncZero(e.payload.Params.startIncZero);
          this.modelMgr.setMaxIncCorr(e.payload.Params.maxIncCorr);
          this.modelMgr.setDistributionFit(e.payload.Params.distributionFit);
          this.modelMgr.setDelta4Fac(e.payload.Params.delta4Fac);
          this.modelMgr.setCountry(e.payload.Params.country);
          this.modelMgr.timeIntCollMgr.setIntervals(
            e.payload.Params.minYear,
            e.payload.Params.maxYear,
            e.payload.Params.timeIntervals
          );
        }
        break;
      case 'MODELS_YEAR_RANGES_DETERMINED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setRangeYears(e.payload.Years.Range);
          this.modelMgr.setOptimalYears(e.payload.Years.Optimal);
        }
        this.notificationsMgr.setMsg(e.payload.ActionMessage);
        break;
      case 'MODELS_RUN_STARTED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setModelsRunProgress(1);
          this.modelMgr.setModelsRunLog(null);
        }
        this.notificationsMgr.setMsg(e.payload.ActionMessage);
        break;
      case 'MODELS_RUN_LOG_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setModelsRunLog(e.payload.RunLog);
        }
        break;
      case 'MODELS_RUN_FINISHED':
        this.modelMgr.setModelsRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setPlotData(e.payload.PlotData);
          this.uiStateMgr.setLastEventType(e.type);
        }
        this.notificationsMgr.setMsg(e.payload.ActionMessage);
        break;
      case 'MODELS_RUN_CANCELLED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setModelsRunProgress(null);
          this.notificationsMgr.setMsg(e.payload.ActionMessage);
        }
        break;
      case 'BOOTSTRAP_RUN_STARTED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setBootstrapRunProgress(1);
          this.modelMgr.setBootstrapRunLog(null);
        }
        break;
      case 'BOOTSTRAP_RUN_LOG_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setBootstrapRunLog(e.payload.RunLog);
        }
        break;
      case 'BOOTSTRAP_RUN_FINISHED':
        this.modelMgr.setBootstrapRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setPlotData(e.payload.PlotData);
          this.uiStateMgr.setLastEventType(e.type);
        }
        this.notificationsMgr.setMsg(e.payload.ActionMessage);
        break;
      case 'BOOTSTRAP_RUN_CANCELLED':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.modelMgr.setBootstrapRunProgress(null);
          this.notificationsMgr.setMsg(e.payload.ActionMessage);
        }
        break;
      case 'SEED_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.setSeed(e.payload.Seed);
          this.notificationsMgr.setMsg(e.payload.ActionMessage);
        }
        break;
      case 'SAVE_STATE':
        if (e.payload.ActionStatus === 'SUCCESS') {
          SaveDataLocally(e.payload.Data, e.payload.FileName);
          this.notificationsMgr.setMsg(e.payload.ActionMessage);
        }
        break;
    };
  };

  constructor() {
    this.uiStateMgr = new UIStateManager(this);
    this.notificationsMgr = new NotificationsManager(this);
    this.caseBasedDataMgr = new CaseBasedDataManager(this);
    this.aggrDataMgr = new AggrDataManager(this);
    this.attrMappingMgr = new AttrMappingManager(this);
    this.origGroupMgr = new OriginGroupingsManager(this);
    this.summaryDataMgr = new SummaryDataManager(this);
    this.adjustMgr = new AdjustmentsManager(this);
    this.popMgr = new PopulationsManager(this);
    this.popCombMgr = new PopCombinationsManager(this);
    this.modelMgr = new ModelsManager(this);
    this.reportMgr = new ReportManager(this);
    this.migrMgr = new MigrationManager(this);

    makeObservable(this, {
      shinyState: observable,
      shinyMessage: observable,
      seed: observable,
      seedText: computed,
      shinyReady: computed,
      jsonShinyMessage: computed,
      setShinyState: action,
      btnClicked: action,
      inputValueSet: action,
      setShinyMessage: action,
      unbindShiny: action,
      bindShiny: action,
      saveState: action,
      setSeed: action
    });
  };

  // Computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED' || this.shinyState === 'DEBUGGING';
  };

  get jsonShinyMessage() {
    return JSON.stringify(this.shinyMessage);
  };

  get seedText() {
    if (IsNull(this.seed)) {
      return ''
    } else {
      return this.seed;
    }
  };

  get shinyStateHuman() {
    let result = '';
    switch (this.shinyState) {
      case 'DISCONNECTED':
        result = 'DISCONNECTED';
        break;
      case 'CONNECTED':
        result = 'INITIALIZING';
        break;
      case 'DEBUGGING':
      case 'SESSION_INITIALIZED':
        result = 'READY';
        break;
    }
    return (result);
  };

  // Actions
  setShinyState = state => {
    this.shinyState = state;
    if (state === 'SESSION_INITIALIZED') {
      Shiny.addCustomMessageHandler('shinyHandler', this.onShinyEvent);
    }
  };

  btnClicked = (btnId, value = '') => {
    if (!IsNull(window.Shiny) && this.shinyReady) {
      Shiny.setInputValue(btnId, value, { priority: 'event' });
    } else {
      console.log('btnClicked: Shiny is not available', btnId, toJS(value));
    }
  };

  inputValueSet = (inputId, value) => {
    if (!IsNull(window.Shiny) && this.shinyReady) {
      Shiny.setInputValue(inputId, value);
    } else {
      console.log('inputValueSet: Shiny is not available', inputId, toJS(value));
    }
  };

  setShinyMessage = msg => this.shinyMessage = msg;

  setSeed = seed => {
    console.log(seed);
    if (seed === '') {
      this.seed = null;
    } else {
      this.seed = seed;
    }
  };

  unbindShiny = els => {
    if (!IsNull(window.Shiny) && this.shinyReady) {
      window.Shiny.unbindAll();
      EnsureArray(els).forEach(el => delete window.Shiny.shinyapp.$bindings[el]);
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  };

  bindShiny = () => {
    if (!IsNull(window.Shiny) && this.shinyReady) {
      window.Shiny.bindAll();
    } else {
      console.log('bindShinyInputs: Shiny is not available');
    }
  };

  saveState = () => {
    const js = serialize(this);
    const json = JSON.stringify(js, {}, 2);
    this.btnClicked('saveStateBtn', json);
  }
};

class TimeIntervalsCollectionManager { };
class TimeIntervalsManager { };
createModelSchema(TimeIntervalsManager, {
  parentMgr: reference(TimeIntervalsCollectionManager),
  id: primitive(),
  name: primitive(),
  intervals: list(raw()),
  minYear: primitive(),
  maxYear: primitive()
});

createModelSchema(TimeIntervalsCollectionManager, {
  id: identifier(),
  parentMgr: reference(ModelsManager),
  collections: map(object(TimeIntervalsManager)),
  minYear: primitive(),
  maxYear: primitive(),
  selectedEditCollectionId: primitive(),
  selectedRunCollectionId: primitive()
});

createModelSchema(ModelsManager, {
  id: identifier(),
  parentMgr: reference(AppManager),
  timeIntCollMgr: object(TimeIntervalsCollectionManager),
  modelsParamFile: primitive(),
  modelsParamFileName: primitive(),
  rangeYears: raw(),
  optimalYears: raw(),
  minYear: primitive(),
  maxYear: primitive(),
  minFitPos: primitive(),
  maxFitPos: primitive(),
  minFitCD4: primitive(),
  maxFitCD4: primitive(),
  minFitAIDS: primitive(),
  maxFitAIDS: primitive(),
  minFitHIVAIDS: primitive(),
  maxFitHIVAIDS: primitive(),
  fullData: primitive(),
  knotsCount: primitive(),
  startIncZero: primitive(),
  maxIncCorr: primitive(),
  distributionFit: primitive(),
  delta4Fac: primitive(),
  country: primitive(),
  bootstrapCount: primitive(),
  bootstrapType: primitive(),
  modelsRunProgress: primitive(),
  modelsRunLog: primitive(),
  bootstrapRunProgress: primitive(),
  bootstrapRunLog: primitive(),
  plotData: raw(),
});

createModelSchema(ReportManager, {
  rootMgr: reference(AppManager),
  report: primitive(),
  adjustReportParams: raw(),
  creatingReportInProgress: primitive()
});

class PopCombinationsManagerCombination { };
createModelSchema(PopCombinationsManagerCombination, {
  id: identifier(),
  name: primitive(),
  aggrPopulations: list(primitive()),
  casePopulations: list(primitive())
});

createModelSchema(PopCombinationsManager, {
  rootMgr: reference(AppManager),
  combinations: map(object(PopCombinationsManagerCombination)),
  selectedCombination: reference(PopCombinationsManagerCombination),
  combinationAllId: primitive()
});

createModelSchema(PopulationsManager, {
  rootMgr: reference(AppManager),
  availableVariables: list(raw()),
  availableStrata: raw(),
  populations: list(raw())
});

createModelSchema(AdjustmentsManager, {
  rootMgr: reference(AppManager),
  miAdjustType: primitive(),
  miJomoSettings: raw(),
  miMiceSettings: raw(),
  rdAdjustType: primitive(),
  dataBounds: raw(),
  rdWithoutTrendSettings: raw(),
  rdWithTrendSettings: raw(),
  adjustmentsRunProgress: primitive(),
  adjustmentsRunLog: primitive(),
  adjustmentsReport: primitive()
});

createModelSchema(SummaryDataManager, {
  rootMgr: reference(AppManager),
  selectedCount: primitive(),
  totalCount: primitive(),
  diagYearPlotData: raw(),
  notifQuarterPlotData: raw(),
  missPlotData: raw(),
  missPlotSelection: primitive(),
  repDelPlotData: raw(),
  repDelPlotSelection: primitive()
});

createModelSchema(AggrDataManager, {
  rootMgr: reference(AppManager),
  fileName: primitive(),
  fileSize: primitive(),
  fileType: primitive(),
  filePath: primitive(),
  dataFiles: raw(),
  origDataFiles: raw(),
  rangeYears: raw(),
  dataFileNameToIdxMap: map(),
  populationNames: list(primitive()),
  fileUploadProgress: primitive(),
  actionStatus: primitive(),
  actionMessage: primitive()
});

createModelSchema(CaseBasedDataManager, {
  rootMgr: reference(AppManager),
  fileName: primitive(),
  fileSize: primitive(),
  fileType: primitive(),
  filePath: primitive(),
  columnNames: list(primitive()),
  recordCount: primitive(),
  uploadProgress: primitive(),
  actionStatus: primitive(),
  actionMessage: primitive()
});

createModelSchema(OriginGroupingsManager, {
  rootMgr: reference(AppManager),
  distribution: raw(),
  groupings: list(raw()),
  type: primitive(),
  actionStatus: primitive(),
  actionMessage: primitive()
});

createModelSchema(AttrMappingManager, {
  rootMgr: reference(AppManager),
  mapping: list(raw()),
  actionStatus: primitive(),
  actionMessage: primitive()
});

createModelSchema(NotificationsManager, {
  rootMgr: reference(AppManager),
  msgInfo: raw()
});

createModelSchema(UIStateManager, {
  rootMgr: reference(AppManager),
  lastEventType: primitive(),
  completedSteps: list(primitive()),
  pages: list(raw()),
  activePageId: primitive()
});

createModelSchema(AppManager, {
  id: identifier(),
  shinyState: primitive(),
  uiStateMgr: object(UIStateManager),
  notificationsMgr: object(NotificationsManager),
  attrMappingMgr: object(AttrMappingManager),
  origGroupMgr: object(OriginGroupingsManager),
  caseBasedDataMgr: object(CaseBasedDataManager),
  aggrDataMgr: object(AggrDataManager),
  summaryDataMgr: object(SummaryDataManager),
  adjustMgr: object(AdjustmentsManager),
  popMgr: object(PopulationsManager),
  popCombMgr: object(PopCombinationsManager),
  modelMgr: object(ModelsManager),
  reportMgr: object(ReportManager)
});

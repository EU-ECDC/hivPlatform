import { observable, action, configure, computed, toJS, makeObservable } from 'mobx';
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
import IsNull from '../utilities/IsNull';
import EnsureArray from '../utilities/EnsureArray';
import FloatToQuarter from '../utilities/FloatToQuarter';

configure({
  enforceActions: 'observed',
  computedRequiresReaction: true,
});

export default class AppManager {
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
  modelMgr = null

  shinyState = 'DISCONNECTED';

  shinyMessage = {};

  report = '';

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
          this.origGroupMgr.setType(e.payload.OriginGroupingType);
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
          this.origGroupMgr.setType(e.payload.OriginGroupingType);
          this.origGroupMgr.setGroupings(e.payload.OriginGrouping);
        } else {
          this.notificationsMgr.setMsg('There was a problem with setting this origin grouping');
        }
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED':
        this.origGroupMgr.setActionStatus(e.payload.ActionStatus);
        this.origGroupMgr.setActionMessage(e.payload.ActionMessage);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.summaryDataMgr.reset();
          this.summaryDataMgr.setDiagYearPlotData(e.payload.Summary.DiagYearPlotData);
          this.summaryDataMgr.setNotifQuarterPlotData(e.payload.Summary.NotifQuarterPlotData);
          this.adjustMgr.setRDWithoutStartYear(e.payload.Summary.DiagYearPlotData.filter.scaleMinYear);
          this.adjustMgr.setRDWithoutEndYear(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear);
          this.adjustMgr.setRDWithoutEndQrt(FloatToQuarter(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
          this.adjustMgr.setRDWithStartYear(e.payload.Summary.DiagYearPlotData.filter.scaleMinYear);
          this.adjustMgr.setRDWithEndYear(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear);
          this.adjustMgr.setRDWithEndQrt(FloatToQuarter(e.payload.Summary.NotifQuarterPlotData.filter.scaleMaxYear));
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
        }
        break;
      case 'ADJUSTMENTS_RUN_FINISHED':
        this.adjustMgr.setAdjustmentsRunProgress(null);
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.uiStateMgr.setLastEventType(e.type);
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
      case 'ADJUSTMENTS_RUN_LOG_SET':
        if (e.payload.ActionStatus === 'SUCCESS') {
          this.adjustMgr.setAdjustmentsRunLog(e.payload.RunLog);
        }
        break;

      // case 'AGGR_DATA_UPLOADED':
      //   this.aggrDataMgr.setFileName(e.payload.FileName);
      //   this.aggrDataMgr.setFilePath(e.payload.FilePath);
      //   this.aggrDataMgr.setFileSize(e.payload.FileSize);
      //   this.aggrDataMgr.setFileType(e.payload.FileType);
      //   break;
      // case 'AGGR_DATA_READ':
      //   this.aggrDataMgr.setDataFiles(e.payload.DataFiles);
      //   this.aggrDataMgr.setPopulationNames(e.payload.PopulationNames);
      //   this.notificationsMgr.setMsg('Aggregated data uploaded');
      //   break;
      // case 'AVAILABLE_STRATA_SET':
      //   this.popMgr.setAvailableStrata(event.Payload.AvailableStrata);
      //   break;
      // case 'MODELS_PARAMS_SET':
      //   this.modelMgr.setMinYear(event.Payload.Params.minYear);
      //   this.modelMgr.setMaxYear(event.Payload.Params.maxYear);
      //   this.modelMgr.setMinFitPos(event.Payload.Params.minFitPos);
      //   this.modelMgr.setMaxFitPos(event.Payload.Params.maxFitPos);
      //   this.modelMgr.setMinFitCD4(event.Payload.Params.minFitCD4);
      //   this.modelMgr.setMaxFitCD4(event.Payload.Params.maxFitCD4);
      //   this.modelMgr.setMinFitAIDS(event.Payload.Params.minFitAIDS);
      //   this.modelMgr.setMaxFitAIDS(event.Payload.Params.maxFitAIDS);
      //   this.modelMgr.setMinFitHIVAIDS(event.Payload.Params.minFitHIVAIDS);
      //   this.modelMgr.setMaxFitHIVAIDS(event.Payload.Params.maxFitHIVAIDS);
      //   this.modelMgr.setFullData(event.Payload.Params.fullData);
      //   this.modelMgr.setKnotsCount(event.Payload.Params.knotsCount);
      //   this.modelMgr.setStartIncZero(event.Payload.Params.startIncZero);
      //   this.modelMgr.setMaxIncCorr(event.Payload.Params.maxIncCorr);
      //   this.modelMgr.setDistributionFit(event.Payload.Params.distributionFit);
      //   this.modelMgr.setDelta4Fac(event.Payload.Params.delta4Fac);
      //   this.modelMgr.setCountry(event.Payload.Params.country);
      //   this.modelMgr.setRDisp(event.Payload.Params.rDisp);
      //   this.modelMgr.setSplineType(event.Payload.Params.splineType);
      //   this.modelMgr.timeIntMgr.setIntervals(
      //     event.Payload.Params.minYear,
      //     event.Payload.Params.maxYear,
      //     event.Payload.Params.timeIntervals
      //   );
      //   break;
      // case 'MODELS_RUN_STARTED':
      //   this.modelMgr.setModelsRunProgress(1);
      //   break;
      // case 'MODELS_RUN_LOG_SET':
      //   this.modelMgr.setModelsRunLog(event.Payload.RunLog);
      //   break;
      // case 'MODELS_RUN_FINISHED':
      //   this.modelMgr.setModelsRunProgress(null);
      //   this.notificationsMgr.setMsg('Model run finished');
      //   break;
      // case 'BOOTSTRAP_RUN_STARTED':
      //   this.modelMgr.setBootstrapRunProgress(1);
      //   break;
      // case 'BOOTSTRAP_RUN_LOG_SET':
      //   this.modelMgr.setBootstrapRunLog(event.Payload.RunLog);
      //   break;
      // case 'BOOTSTRAP_RUN_FINISHED':
      //   this.modelMgr.setBootstrapRunProgress(null);
      //   this.notificationsMgr.setMsg('Bootstrap run finished');
      //   break
      // case 'REPORT_SET':
      //   this.setReport(event.Payload.Report);
      //   break;
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

    // this.uiStateMgr.setLastEventType('START');

    makeObservable(this, {
      shinyState: observable,
      shinyMessage: observable,
      shinyReady: computed,
      jsonShinyMessage: computed,
      setShinyState: action,
      btnClicked: action,
      inputValueSet: action,
      setShinyMessage: action,
      unbindShiny: action,
      bindShiny: action
    });
  };

  // Computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED' || this.shinyState === 'DEBUGGING';
  };

  get jsonShinyMessage() {
    return JSON.stringify(this.shinyMessage);
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

  setReport = report => this.report = report;

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

  setShinyMessage = msg => {
    this.shinyMessage = msg;
  };

  unbindShiny = (els) => {
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
}

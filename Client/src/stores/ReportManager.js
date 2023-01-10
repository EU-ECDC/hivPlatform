import { observable, action, makeObservable} from 'mobx';

export default class ReportManager {
  rootMgr = null;

  report = null;

  adjustReportParams = {
    reportingDelay: true,
    smoothing: false,
    cd4ConfInt: false,
  };

  creatingReportInProgress = false;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      report: observable,
      adjustReportParams: observable,
      creatingReportInProgress: observable,
      setReport: action,
      setAdjustReportReportingDelay: action,
      setAdjustReportSmoothing: action,
      setAdjustReportCD4ConfInt: action,
      restoreDefaults: action,
      createReport: action,
      cancelCreatingReport: action,
      setCreatingReportInProgress: action,
    });
  };

  setReport = report => this.report = report;

  setAdjustReportReportingDelay = val => this.adjustReportParams.reportingDelay = val;
  setAdjustReportSmoothing = val => this.adjustReportParams.smoothing = val;
  setAdjustReportCD4ConfInt = val => this.adjustReportParams.cd4ConfInt = val;
  setCreatingReportInProgress = val => this.creatingReportInProgress = val;

  createReport = () => {
    this.rootMgr.btnClicked('createReportBtn',
      Object.assign(
        { name: 'Main Report' },
        this.adjustReportParams
      )
    )
  };

  cancelCreatingReport = () => this.rootMgr.btnClicked('cancelCreatingReportBtn');

  restoreDefaults = () => {
    this.adjustReportParams = {
      reportingDelay: true,
      smoothing: false,
      cd4ConfInt: false,
    }
  };

  setUIState = uiState => {
    this.report = uiState.report;
    this.adjustReportParams = uiState.adjustReportParams;
    this.creatingReportInProgress = uiState.creatingReportInProgress;
  }
}

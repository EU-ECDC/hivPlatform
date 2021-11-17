import { observable, action, computed, makeObservable } from 'mobx';

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  report = null;

  dataCompatibleFlag = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      dataCompatibleFlag: observable,
      runInProgress: computed,
      setRunProgress: action,
      setRunLog: action,
      setReport: action,
      setDataCompatibleFlag: action,
      run: action,
      cancel: action
    });
  };

  get runInProgress() {
    return this.runProgress !== null;
  };

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setReport = report => this.report = report;

  setDataCompatibleFlag = dataCompatibleFlag => this.dataCompatibleFlag = dataCompatibleFlag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

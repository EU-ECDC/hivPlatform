import { observable, action, computed, makeObservable } from 'mobx';

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  report = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      runInProgress: computed,
      setRunProgress: action,
      setRunLog: action,
      setReport: action,
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

  run = () => {
    this.rootMgr.btnClicked('runMigrantBtn');
  };

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

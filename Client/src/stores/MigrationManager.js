import { observable, action, computed, makeObservable } from 'mobx';

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      runInProgress: computed,
      setRunProgress: action,
      setRunLog: action,
      run: action,
      cancel: action
    });
  };

  get runInProgress() {
    return this.runProgress !== null;
  };

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  run = () => {
    this.rootMgr.btnClicked('runMigrantBtn');
  };

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

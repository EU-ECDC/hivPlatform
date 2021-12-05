import { observable, action, computed, makeObservable } from 'mobx';

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  stats = null;

  dataCompatibleFlag = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      dataCompatibleFlag: observable,
      runInProgress: computed,
      missingnessArray: computed,
      setRunProgress: action,
      setRunLog: action,
      setStats: action,
      setDataCompatibleFlag: action,
      run: action,
      cancel: action
    });
  };

  get runInProgress() {
    return this.runProgress !== null;
  };

  get missingnessArray() {
    const excluded = this.stats.Missingness.Excluded;
    const counts = this.stats.Missingness.Count;
    const arr = excluded.map((el, i) => ({
      excluded: excluded[i],
      count: counts[i],
      isTotal: /Total/.test(excluded[i])
    }));

    return arr;
  };

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setStats = stats => this.stats = stats;

  setDataCompatibleFlag = dataCompatibleFlag => this.dataCompatibleFlag = dataCompatibleFlag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

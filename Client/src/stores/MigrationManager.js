import { observable, action, computed, makeObservable } from 'mobx';
import IsNull from '../utilities/IsNull'

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
      regionDistr: computed,
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
    let arr = [];
    if (!IsNull(this.stats) && !IsNull(this.stats.Missingness)) {
      const excluded = this.stats.Missingness.Excluded;
      const counts = this.stats.Missingness.Count;
      arr = excluded.map((el, i) => ({
        excluded: excluded[i],
        count: counts[i],
        isTotal: /Total/.test(excluded[i])
      }));
    }
    return arr;
  };

  get regionDistr() {
    let res = null;
    if (!IsNull(this.stats) && !IsNull(this.stats.RegionDistr)) {
      res = this.stats.RegionDistr;
    }
    return res;
  }

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setStats = stats => this.stats = stats;

  setDataCompatibleFlag = dataCompatibleFlag => this.dataCompatibleFlag = dataCompatibleFlag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

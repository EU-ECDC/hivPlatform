import { observable, action, computed, makeObservable, toJS } from 'mobx';
import IsNull from '../utilities/IsNull'

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  inputStats = null;

  outputStats = null;

  dataCompatibleFlag = null;

  yodRegion = 'All';
  tableRegion = 'All';

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      inputStats: observable,
      outputStats: observable,
      yodRegion: observable,
      tableRegion: observable,
      dataCompatibleFlag: observable,
      runInProgress: computed,
      missingnessArray: computed,
      regionDistr: computed,
      yodDistr: computed,
      tableDistr: computed,
      setRunProgress: action,
      setRunLog: action,
      setInputStats: action,
      setOutputStats: action,
      setYodRegion: action,
      setTableRegion: action,
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
    if (!IsNull(this.inputStats) && !IsNull(this.inputStats.Missingness)) {
      const excluded = this.inputStats.Missingness.Excluded;
      const counts = this.inputStats.Missingness.Count;
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
    if (!IsNull(this.inputStats) && !IsNull(this.inputStats.RegionDistr)) {
      res = this.inputStats.RegionDistr;
    }
    return res;
  };

  get yodDistr() {
    let res = null;
    if (this.yodRegion != '' && !IsNull(this.inputStats) && !IsNull(this.inputStats.YODDistr)) {
      res = this.inputStats.YODDistr[this.yodRegion];
    }
    return res;
  };

  get tableDistr() {
    let res = null;
    if (
      this.tableRegion != '' &&
      !IsNull(this.outputStats) &&
      !IsNull(this.outputStats.TableDistr) &&
      !IsNull(this.outputStats.TableDistr[this.tableRegion])
    ) {
      res = this.outputStats.TableDistr[this.tableRegion];
    }
    return res;
  }

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setInputStats = inputStats => this.inputStats = inputStats;

  setOutputStats = outputStats => this.outputStats = outputStats;

  setYodRegion = yodRegion => this.yodRegion = yodRegion;

  setTableRegion = tableRegion => this.tableRegion = tableRegion;

  setDataCompatibleFlag = dataCompatibleFlag => this.dataCompatibleFlag = dataCompatibleFlag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

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
      regionDistrArray: computed,
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

  get regionDistrArray() {
    let arr = [];
    if (!IsNull(this.stats) && !IsNull(this.stats.RegionDistr)) {
      const yearOfArrival = this.stats.RegionDistr.YearOfArrival;
      const africa = this.stats.RegionDistr.Africa;
      const europe = this.stats.RegionDistr.Europe;
      const asia = this.stats.RegionDistr.Asia;
      const carlam = this.stats.RegionDistr["Carribean/Latin America"];
      arr = yearOfArrival.map((el, i) => ({
        yearOfArrival: yearOfArrival[i],
        europe: europe[i],
        africa: africa[i],
        asia: asia[i],
        carlam: carlam[i],
        isTotal: /Total/.test(yearOfArrival[i])
      }));
    }
    return arr;
  };

  get yodDistr() {
    let arr = {
      'Europe': [],
      'Africa': [],
      'Asia': [],
      'Carribean/Latin America': []
    };
    if (!IsNull(this.stats) && !IsNull(this.stats.YODDistr)) {
      arr = this.stats.YODDistr;
    }
    return arr;
  };

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setStats = stats => this.stats = stats;

  setDataCompatibleFlag = dataCompatibleFlag => this.dataCompatibleFlag = dataCompatibleFlag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

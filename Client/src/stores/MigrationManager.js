import { observable, action, computed, makeObservable, toJS } from 'mobx';
import IsNull from '../utilities/IsNull'

export default class MigrationManager {
  rootMgr = null;

  runProgress = null;

  runLog = null;

  inputStats = null;

  outputStats = null;

  outputPlots = null;

  dataCompatibleFlag = null;

  yodRegion = 'ALL';
  tableRegion = 'ALL';

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      runProgress: observable,
      runLog: observable,
      inputStats: observable,
      outputStats: observable,
      outputPlots: observable,
      yodRegion: observable,
      tableRegion: observable,
      dataCompatibleFlag: observable,
      runInProgress: computed,
      missingness: computed,
      regionDistr: computed,
      yodDistr: computed,
      tableDistr: computed,
      arrivalPlotData: computed,
      diagnosisPlotData: computed,
      setRunProgress: action,
      setRunLog: action,
      setInputStats: action,
      setOutputStats: action,
      setOutputPlots: action,
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

  get missingness() {
    let res = null;
    if (!IsNull(this.inputStats) && !IsNull(this.inputStats.Missingness)) {
      res = this.inputStats.Missingness;
    }
    return res;
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

  get arrivalPlotData() {
    let res = null;
    if (!IsNull(this.outputPlots) && !IsNull(this.outputPlots.ArrivalPlotData)) {
      res = this.outputPlots.ArrivalPlotData;
    }
    return res;
  };

  get diagnosisPlotData() {
    let res = null;
    if (!IsNull(this.outputPlots) && !IsNull(this.outputPlots.DiagnosisPlotData)) {
      res = this.outputPlots.DiagnosisPlotData;
    }
    return res;
  };

  setRunProgress = progress => this.runProgress = progress;

  setRunLog = runLog => this.runLog = runLog;

  setInputStats = inputStats => this.inputStats = inputStats;

  setOutputStats = outputStats => this.outputStats = outputStats;

  setOutputPlots = outputPlots => this.outputPlots = outputPlots;

  setYodRegion = yodRegion => this.yodRegion = yodRegion;

  setTableRegion = tableRegion => this.tableRegion = tableRegion;

  setDataCompatibleFlag = flag => this.dataCompatibleFlag = flag;

  run = () => this.rootMgr.btnClicked('runMigrantBtn');

  cancel = () => this.rootMgr.btnClicked('cancelMigrantBtn');
}

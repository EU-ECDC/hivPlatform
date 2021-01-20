import { observable, action, makeObservable, computed, autorun } from 'mobx';

export default class AdjustmentsManager {
  rootMgr = null;

  miAdjustType = 'none';

  miJomoSettings = {
    nimp: 2,
    nburn: 100,
    nbetween: 100,
    nsdf: 4,
    imputeRD: false
  };

  miMiceSettings = {
    nimp: 2,
    nit: 10,
    nsdf: 4,
    imputeRD: false
  };

  rdAdjustType = 'none';

  rdWithoutTrendSettings = {
    startYear: 2000,
    endYear: 2017,
    endQrt: 1,
    stratGender: false,
    stratTrans: false,
    stratMigr: false
  };

  rdWithTrendSettings = {
    startYear: 2000,
    endYear: 2017,
    endQrt: 1,
    stratGender: false,
    stratTrans: false,
    stratMigr: false
  };

  adjustmentsRunProgress = null;

  adjustmentsRunLog = null;

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      miAdjustType: observable,
      miJomoSettings: observable,
      miMiceSettings: observable,
      rdAdjustType: observable,
      rdWithoutTrendSettings: observable,
      rdWithTrendSettings: observable,
      adjustmentsRunProgress: observable,
      adjustmentsRunLog: observable,
      miParams: computed,
      rdParams: computed,
      adjustmentSelected: computed,
      adjustmentsRunInProgress: computed,
      setMIAdjustType: action,
      setRDAdjustType: action,
      setMIJomoNimp: action,
      setMIJomoNburn: action,
      setMIJomoNbetween: action,
      setMIJomoNsdf: action,
      setMIJomoImputeRD: action,
      setMIMiceNimp: action,
      setMIMiceNit: action,
      setMIMiceNsdf: action,
      setMIMiceImputeRD: action,
      restoreMIDefaults: action,
      restoreRDDefaults: action,
      setRDWithoutStartYear: action,
      setRDWithoutEndYear: action,
      setRDWithoutEndQrt: action,
      setRDWithoutStratGender: action,
      setRDWithoutStratTrans: action,
      setRDWithoutStratMigr: action,
      setRDWithStartYear: action,
      setRDWithEndYear: action,
      setRDWithEndQrt: action,
      setRDWithStratGender: action,
      setRDWithStratTrans: action,
      setRDWithStratMigr: action,
      runAdjustments: action,
      cancelAdjustments: action,
      setAdjustmentsRunProgress: action,
      setAdjustmentsRunLog: action
    });

    autorun(() => {
      this.rootMgr.uiStateMgr.setSubPageDisabledStatus(3, 1, !this.adjustmentSelected);
    })
  };

  get miParams() {
    let params = null;
    if (this.miAdjustType === 'jomo') {
      params = this.miJomoSettings
    } else if (this.miAdjustType === 'mice') {
      params = this.miMiceSettings
    }
    return (params);
  };

  get rdParams() {
    let params = null;
    if (this.rdAdjustType === 'withoutTrend') {
      params = this.rdWithoutTrendSettings
    } else if (this.rdAdjustType === 'withTrend') {
      params = this.rdWithTrendSettings
    }
    return (params);
  };

  get adjustmentSelected() {
    return (this.miAdjustType !== 'none' || this.rdAdjustType !== 'none');
  };

  get adjustmentsRunInProgress() {
    return this.adjustmentsRunProgress !== null;
  };

  setMIAdjustType = type => this.miAdjustType = type;
  setMIJomoNimp = nimp => this.miJomoSettings.nimp = Math.min(Math.max(nimp, 1), 1000);
  setMIJomoNburn = nburn => this.miJomoSettings.nburn = Math.min(Math.max(nburn, 1), 1000);
  setMIJomoNbetween = nbetween => this.miJomoSettings.nbetween = Math.min(Math.max(nbetween, 1), 1000);
  setMIJomoNsdf = nsdf => this.miJomoSettings.nsdf = nsdf;
  setMIJomoImputeRD = imputeRD => this.miJomoSettings.imputeRD = imputeRD;
  setMIMiceNimp = nimp => this.miMiceSettings.nimp = Math.min(Math.max(nimp, 1), 1000);
  setMIMiceNit = nit => this.miMiceSettings.nit = Math.min(Math.max(nit, 1), 1000);
  setMIMiceNsdf = nsdf => this.miMiceSettings.nsdf = Math.min(Math.max(nsdf, 1), 4);
  setMIMiceImputeRD = imputeRD => this.miMiceSettings.imputeRD = imputeRD;
  restoreMIDefaults = type => {
    if (type === 'jomo') {
      this.miJomoSettings = {
        nimp: 2,
        nburn: 100,
        nbetween: 100,
        nsdf: 4,
        imputeRD: false
      }
    } else if (type === 'mice') {
      this.miMiceSettings = {
        nimp: 2,
        nit: 100,
        nsdf: 4,
        imputeRD: false
      }
    }
  };

  setRDAdjustType = type => this.rdAdjustType = type;
  setRDWithoutStartYear = year => this.rdWithoutTrendSettings.startYear = Math.min(Math.max(year, 1975), 2030);
  setRDWithoutEndYear = year => this.rdWithoutTrendSettings.endYear = Math.min(Math.max(year, 1975), 2030);
  setRDWithoutEndQrt = qrt => this.rdWithoutTrendSettings.endQrt = Math.min(Math.max(qrt, 1), 4);
  setRDWithoutStratGender = stratGender => this.rdWithoutTrendSettings.stratGender = stratGender;
  setRDWithoutStratTrans = stratTrans => this.rdWithoutTrendSettings.stratTrans = stratTrans;
  setRDWithoutStratMigr = stratMigr => this.rdWithoutTrendSettings.stratMigr = stratMigr;
  setRDWithStartYear = year => this.rdWithTrendSettings.startYear = Math.min(Math.max(year, 1975), 2030);
  setRDWithEndYear = year => this.rdWithTrendSettings.endYear = Math.min(Math.max(year, 1975), 2030);
  setRDWithEndQrt = qrt => this.rdWithTrendSettings.endQrt = Math.min(Math.max(qrt, 1), 4);
  setRDWithStratGender = stratGender => this.rdWithTrendSettings.stratGender = stratGender;
  setRDWithStratTrans = stratTrans => this.rdWithTrendSettings.stratTrans = stratTrans;
  setRDWithStratMigr = stratMigr => this.rdWithTrendSettings.stratMigr = stratMigr;

  restoreRDDefaults = type => {
    if (type === 'withoutTrend') {
      this.rdWithoutTrendSettings = {
        startYear: 2000,
        endYear: 2017,
        endQrt: 1,
        stratGender: false,
        stratTrans: false,
        stratMigr: false
      };
    } else if (type === 'withTrend') {
      this.rdWithTrendSettings = {
        startYear: 2000,
        endYear: 2017,
        endQrt: 1,
        stratGender: false,
        stratTrans: false,
        stratMigr: false
      };
    };
  };

  runAdjustments = () => {
    this.rootMgr.btnClicked('runAdjustBtn', {
      Filters: this.rootMgr.summaryDataMgr.filters,
      MIAdjustType: this.miAdjustType,
      MIParams: this.miParams,
      RDAdjustType: this.rdAdjustType,
      RDParams: this.rdParams,
    });
  };

  cancelAdjustments = () => this.rootMgr.btnClicked('cancelAdjustBtn');

  setAdjustmentsRunProgress = progress => this.adjustmentsRunProgress = progress;

  setAdjustmentsRunLog = runLog => this.adjustmentsRunLog = runLog;
}

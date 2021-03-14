import { observable, action, makeObservable, computed, autorun } from 'mobx';

export default class AdjustmentsManager {
  rootMgr = null;

  miAdjustType = 'none';

  miJomoSettings = {
    nimp: 5,
    nburn: 1000,
    nbetween: 500,
    nsdf: 4,
    imputeRD: false
  };

  miMiceSettings = {
    nimp: 5,
    nit: 5,
    nsdf: 4,
    imputeRD: false
  };

  rdAdjustType = 'none';

  dataBounds = {
    startYear: 2000,
    endYear: 2017,
    endQrt: 1
  };

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

  adjustmentsReport = null;

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
      adjustmentsReport: observable,
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
      setAdjustmentsRunLog: action,
      setAdjustmentsReport: action,
      setDataBounds: action
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
  setMIJomoNimp = nimp => this.miJomoSettings.nimp = nimp;
  setMIJomoNburn = nburn => this.miJomoSettings.nburn = nburn;
  setMIJomoNbetween = nbetween => this.miJomoSettings.nbetween = nbetween;
  setMIJomoNsdf = nsdf => this.miJomoSettings.nsdf = nsdf;
  setMIJomoImputeRD = imputeRD => this.miJomoSettings.imputeRD = imputeRD;
  setMIMiceNimp = nimp => this.miMiceSettings.nimp = nimp;
  setMIMiceNit = nit => this.miMiceSettings.nit = nit;
  setMIMiceNsdf = nsdf => this.miMiceSettings.nsdf = nsdf;
  setMIMiceImputeRD = imputeRD => this.miMiceSettings.imputeRD = imputeRD;
  restoreMIDefaults = type => {
    if (type === 'jomo') {
      this.miJomoSettings = {
        nimp: 5,
        nburn: 1000,
        nbetween: 500,
        nsdf: 4,
        imputeRD: false
      }
    } else if (type === 'mice') {
      this.miMiceSettings = {
        nimp: 5,
        nit: 5,
        nsdf: 4,
        imputeRD: false
      }
    }
  };

  setRDAdjustType = type => this.rdAdjustType = type;
  setRDWithoutStartYear = year => this.rdWithoutTrendSettings.startYear = year;
  setRDWithoutEndYear = year => this.rdWithoutTrendSettings.endYear = year;
  setRDWithoutEndQrt = qrt => this.rdWithoutTrendSettings.endQrt = qrt;
  setRDWithoutStratGender = stratGender => this.rdWithoutTrendSettings.stratGender = stratGender;
  setRDWithoutStratTrans = stratTrans => this.rdWithoutTrendSettings.stratTrans = stratTrans;
  setRDWithoutStratMigr = stratMigr => this.rdWithoutTrendSettings.stratMigr = stratMigr;
  setRDWithStartYear = year => this.rdWithTrendSettings.startYear = year;
  setRDWithEndYear = year => this.rdWithTrendSettings.endYear = year;
  setRDWithEndQrt = qrt => this.rdWithTrendSettings.endQrt = qrt;
  setRDWithStratGender = stratGender => this.rdWithTrendSettings.stratGender = stratGender;
  setRDWithStratTrans = stratTrans => this.rdWithTrendSettings.stratTrans = stratTrans;
  setRDWithStratMigr = stratMigr => this.rdWithTrendSettings.stratMigr = stratMigr;
  setDataBounds = dataBounds => this.dataBounds = dataBounds;

  restoreRDDefaults = type => {
    if (type === 'withoutTrend') {
      this.rdWithoutTrendSettings = {
        startYear: this.dataBounds.startYear,
        endYear: this.dataBounds.endYear,
        endQrt: this.dataBounds.endQrt,
        stratGender: false,
        stratTrans: false,
        stratMigr: false
      };
    } else if (type === 'withTrend') {
      this.rdWithTrendSettings = {
        startYear: this.dataBounds.startYear,
        endYear: this.dataBounds.endYear,
        endQrt: this.dataBounds.endQrt,
        stratGender: false,
        stratTrans: false,
        stratMigr: false
      };
    };
  };

  runAdjustments = () => {
    this.rootMgr.btnClicked('runAdjustBtn', {
      MIAdjustType: this.miAdjustType,
      MIParams: this.miParams,
      RDAdjustType: this.rdAdjustType,
      RDParams: this.rdParams,
    });
  };

  cancelAdjustments = () => this.rootMgr.btnClicked('cancelAdjustBtn');

  setAdjustmentsRunProgress = progress => this.adjustmentsRunProgress = progress;

  setAdjustmentsRunLog = runLog => this.adjustmentsRunLog = runLog;

  setAdjustmentsReport = report => this.adjustmentsReport = report;

}

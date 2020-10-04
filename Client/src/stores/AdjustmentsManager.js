import { observable, action, makeObservable, computed } from 'mobx';

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

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      miAdjustType: observable,
      miJomoSettings: observable,
      miMiceSettings: observable,
      rdAdjustType: observable,
      rdWithoutTrendSettings: observable,
      rdWithTrendSettings: observable,
      miParams: computed,
      rdParams: computed,
      adjustmentSelected: computed,
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
    });
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
      MIAdjustType: this.miAdjustType,
      MIParams: this.miParams,
      RDAdjustType: this.rdAdjustType,
      RDParams: this.rdParams,
    });
  };

  cancelAdjustments = () => {
    this.rootMgr.btnClicked('cancelAdjustBtn');
  };

}

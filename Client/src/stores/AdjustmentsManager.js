import { observable, action, makeObservable } from 'mobx';

export default class AdjustmentsManager {
  rootMgr = null;

  miAdjustType = 'none';

  miJomoSettings = {
    nimp: 2,
    nburn: 100,
    nbetween: 100,
    nsdf: 4
  }

  miMiceSettings = {
    nimp: 2,
    nit: 100,
    nsdf: 4
  }

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      miAdjustType: observable,
      miJomoSettings: observable,
      miMiceSettings: observable,
      setMIAdjustType: action,
      setMIJomoNimp: action,
      setMIJomoNburn: action,
      setMIJomoNbetween: action,
      setMIJomoNsdf: action,
      setMIMiceNimp: action,
      setMIMiceNit: action,
      setMIMiceNsdf: action
    });
  };

  setMIAdjustType = type => this.miAdjustType = type;
  setMIJomoNimp = nimp => this.miJomoSettings.nimp = nimp;
  setMIJomoNburn = nburn => this.miJomoSettings.nburn = nburn;
  setMIJomoNbetween = nbetween => this.miJomoSettings.nbetween = nbetween;
  setMIJomoNsdf = nsdf => this.miJomoSettings.nsdf = nsdf;
  setMIMiceNimp = nimp => this.miMiceSettings.nimp = nimp;
  setMIMiceNit = nit => this.miMiceSettings.nit = nit;
  setMIMiceNsdf = nsdf => this.miMiceSettings.nsdf = nsdf;
}

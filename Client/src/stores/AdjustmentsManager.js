import { observable, action, computed, toJS } from 'mobx';

export default class AdjustmentsManager {
  rootMgr = null;

  @observable
  miAdjustType = 'none';

  @observable
  miJomoSettings = {
    nimp: 2,
    nburn: 100,
    nbetween: 100,
    nsdf: 4
  }

  @observable
  miMiceSettings = {
    nimp: 2,
    nit: 100,
    nsdf: 4
  }

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action setMIAdjustType = type => this.miAdjustType = type;
  @action setMIJomoNimp = nimp => this.miJomoSettings.nimp = nimp;
  @action setMIJomoNburn = nburn => this.miJomoSettings.nburn = nburn;
  @action setMIJomoNbetween = nbetween => this.miJomoSettings.nbetween = nbetween;
  @action setMIJomoNsdf = nsdf => this.miJomoSettings.nsdf = nsdf;
  @action setMIMiceNimp = nimp => this.miMiceSettings.nimp = nimp;
  @action setMIMiceNit = nit => this.miMiceSettings.nit = nit;
  @action setMIMiceNsdf = nsdf => this.miMiceSettings.nsdf = nsdf;
}

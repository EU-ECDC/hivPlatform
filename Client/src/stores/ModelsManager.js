import { observable, action, computed, makeObservable } from 'mobx';

export default class ModelsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      modelsRunProgress: observable,
      modelsRunLog: observable,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      modelsRunInProgress: computed,
    });
  };

  modelsRunProgress = null;
  modelsRunLog = null;

  runModels = () => this.rootMgr.btnClicked('runModelBtn');
  cancelModels = () => this.rootMgr.btnClicked('cancelModelBtn');
  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

}

import { observable, action, computed, makeObservable, autorun } from 'mobx';
import LoadTxtFile from '../utilities/LoadTxtFile';

export default class ModelsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      modelsRunProgress: observable,
      modelsRunLog: observable,
      modelsParamFileName: observable,
      modelsParamFileContent: observable,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      setModelsParamFileName: action,
      modelsRunInProgress: computed,
    });

    autorun(() => {
      this.rootMgr.inputValueSet('modelsParameters', this.modelsParamFileContent);
    });
  };

  modelsRunProgress = null;
  modelsRunLog = null;
  modelsParamFileName = null;
  modelsParamFileContent = null;

  runModels = () => this.rootMgr.btnClicked('runModelBtn');
  cancelModels = () => this.rootMgr.btnClicked('cancelModelBtn');
  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  setModelsParamFileName = paramFileName => {
    this.modelsParamFileName = paramFileName;
    if (this.modelsParamFileName) {
      LoadTxtFile(this.modelsParamFileName).then(
        action("success", content => this.modelsParamFileContent = content),
        action("error", error => console.log(error))
      );
    }
  };

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

}

import { observable, action, computed, makeObservable, autorun } from 'mobx';
import LoadTxtFile from '../utilities/LoadTxtFile';

export default class ModelsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;

    makeObservable(this, {
      modelsRunProgress: observable,
      modelsRunLog: observable,
      modelsParamFile: observable,
      modelsParamFileName: observable,
      modelsParamFileContent: observable,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      setModelsParamFile: action,
      modelsRunInProgress: computed,
    });

    autorun(() => {
      this.rootMgr.inputValueSet('xmlModel', this.modelsParamFileContent);
    });
  };

  modelsRunProgress = null;
  modelsRunLog = null;
  modelsParamFile = null;
  modelsParamFileName = '';
  modelsParamFileContent = null;

  runModels = () => this.rootMgr.btnClicked('runModelBtn');
  cancelModels = () => this.rootMgr.btnClicked('cancelModelBtn');
  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  setModelsParamFile = paramFile => {
    if (paramFile) {
      this.modelsParamFile = paramFile;
      this.modelsParamFileName = paramFile.name;
      LoadTxtFile(this.modelsParamFile).then(
        action("success", content => this.modelsParamFileContent = content),
        action("error", error => console.log(error))
      );
    }
  };

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

}

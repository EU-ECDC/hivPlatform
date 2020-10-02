import { observable, action, computed, makeObservable } from 'mobx';

export default class AggrDataManager {
  rootMgr = null;
  fileName = null;
  fileSize = null;
  fileType = null;
  filePath = null;
  dataNames = [];
  populationNames = [];
  fileUploadProgress = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      fileName: observable,
      fileSize: observable,
      fileType: observable,
      filePath: observable,
      dataNames: observable,
      populationNames: observable,
      fileUploadProgress: observable,
      dataNamesString: computed,
      populationNamesString: computed,
      setFileName: action,
      setFileSize: action,
      setFileType: action,
      setFilePath: action,
      setDataNames: action,
      setPopulationNames: action,
      setFileUploadProgress: action
    });
  };

  setFileName = fileName => this.fileName = fileName;
  setFileSize = fileSize => this.fileSize = fileSize;
  setFileType = fileType => this.fileType = fileType;
  setFilePath = filePath => this.filePath = filePath;
  setDataNames = dataNames => {
    const arr = Array.isArray(dataNames) ? dataNames : [dataNames];
    this.dataNames = arr;
  };
  setPopulationNames = populationNames => {
    const arr = Array.isArray(populationNames) ? populationNames : [populationNames];
    this.populationNames = arr;
  };
  setFileUploadProgress = progress => this.fileUploadProgress = progress;

  get dataNamesString() {
    if (this.dataNames === null) {
      return '';
    }
    return this.dataNames.join(', ');
  };
  get populationNamesString() {
    if (this.populationNames === null) {
      return '';
    }
    return this.populationNames.join(', ');
  };
}

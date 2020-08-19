import { observable, action, computed } from 'mobx';

export default class AggrDataManager {
  rootMgr = null;

  @observable
  fileName = null;

  @observable
  fileSize = null;

  @observable
  fileType = null;

  @observable
  filePath = null;

  @observable
  dataNames = [];

  @observable
  populationNames = [];

  @observable
  fileUploadProgress = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action setFileName = fileName => this.fileName = fileName;
  @action setFileSize = fileSize => this.fileSize = fileSize;
  @action setFileType = fileType => this.fileType = fileType;
  @action setFilePath = filePath => this.filePath = filePath;
  @action setDataNames = dataNames => {
    const arr = Array.isArray(dataNames) ? dataNames : [dataNames];
    this.dataNames = arr;
  };
  @action setPopulationNames = populationNames => {
    const arr = Array.isArray(populationNames) ? populationNames : [populationNames];
    this.populationNames = arr;
  };
  @action setFileUploadProgress = progress => this.fileUploadProgress = progress;

  @computed
  get dataNamesString() {
    if (this.dataNames === null) {
      return '';
    }
    return this.dataNames.join(', ');
  };

  @computed
  get populationNamesString() {
    if (this.populationNames === null) {
      return '';
    }
    return this.populationNames.join(', ');
  };
}

import { observable, action, computed } from 'mobx';

export default class CaseBasedDataManager {
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
  columnNames = [];

  @observable
  recordCount = null;

  @observable
  fileUploadProgress = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action setFileName = fileName => this.fileName = fileName;
  @action setFileSize = fileSize => this.fileSize = fileSize;
  @action setFileType = fileType => this.fileType = fileType;
  @action setFilePath = filePath => this.filePath = filePath;
  @action setRecordCount = recordCount => this.recordCount = recordCount;
  @action setColumnNames = columnNames => {
    const arr = Array.isArray(columnNames) ? columnNames : [columnNames];
    this.columnNames = arr;
  };
  @action setFileUploadProgress = progress => this.fileUploadProgress = progress;

  @computed
  get columnNamesString() {
    if (this.columnNames === null) {
      return '';
    }
    return this.columnNames.join(', ');
  };
}

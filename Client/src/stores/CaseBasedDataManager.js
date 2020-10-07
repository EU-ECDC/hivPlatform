import { observable, action, computed, makeObservable } from 'mobx';
import EnsureArray from '../utilities/EnsureArray';

export default class CaseBasedDataManager {
  rootMgr = null;

  fileName = null;
  fileSize = null;
  fileType = null;
  filePath = null;
  columnNames = [];
  recordCount = null;
  fileUploadProgress = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      fileName: observable,
      fileSize: observable,
      fileType: observable,
      filePath: observable,
      columnNames: observable,
      recordCount: observable,
      fileUploadProgress: observable,
      setFileName: action,
      setFileSize: action,
      setFileType: action,
      setFilePath: action,
      setRecordCount: action,
      setColumnNames: action,
      setColumnNames: action,
      setFileUploadProgress: action,
      columnNamesString: computed
    });
  };

  setFileName = fileName => this.fileName = fileName;
  setFileSize = fileSize => this.fileSize = fileSize;
  setFileType = fileType => this.fileType = fileType;
  setFilePath = filePath => this.filePath = filePath;
  setRecordCount = recordCount => this.recordCount = recordCount;
  setColumnNames = columnNames => this.columnNames = EnsureArray(columnNames);
  setFileUploadProgress = progress => this.fileUploadProgress = progress;

  get columnNamesString() {
    if (this.columnNames === null) {
      return '';
    }
    return this.columnNames.join(', ');
  };
}

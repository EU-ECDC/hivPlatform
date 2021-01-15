import { observable, action, computed, makeObservable } from 'mobx';
import ReactFileUploader from '../utilities/Uploader';
import EnsureArray from '../utilities/EnsureArray';
import IsNull from '../utilities/IsNull';

export default class CaseBasedDataManager {
  rootMgr = null;

  fileName = null;
  fileSize = null;
  fileType = null;
  filePath = null;
  columnNames = [];
  recordCount = null;
  uploadProgress = null;
  actionStatus = null;
  actionMessage = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      fileName: observable,
      fileSize: observable,
      fileType: observable,
      filePath: observable,
      columnNames: observable,
      recordCount: observable,
      uploadProgress: observable,
      actionStatus: observable,
      actionMessage: observable,
      setFileName: action,
      setFileSize: action,
      setFileType: action,
      setFilePath: action,
      setRecordCount: action,
      setColumnNames: action,
      setColumnNames: action,
      uploadData: action,
      setUploadProgress: action,
      setActionStatus: action,
      setActionMessage: action,
      columnNamesString: computed,
      actionValid: computed
    });
  };

  setFileName = fileName => this.fileName = fileName;
  setFileSize = fileSize => this.fileSize = fileSize;
  setFileType = fileType => this.fileType = fileType;
  setFilePath = filePath => this.filePath = filePath;
  setRecordCount = recordCount => this.recordCount = recordCount;
  setColumnNames = columnNames => this.columnNames = EnsureArray(columnNames);
  setUploadProgress = progress => this.uploadProgress = progress;
  setActionStatus = status => this.actionStatus = status;
  setActionMessage = message => this.actionMessage = message;

  uploadData = el => {
    var $el = $(el);

    $el.data(
      'currentUploader',
      new ReactFileUploader(
        Shiny.shinyapp,
        el,
        this.setUploadProgress
      )
    );
  };

  get columnNamesString() {
    if (this.columnNames === null) {
      return '';
    }
    return this.columnNames.join(', ');
  };

  get actionValid() {
    if (IsNull(this.actionStatus)) {
      return (null);
    } else {
      return this.actionStatus === 'SUCCESS';
    }
  };
}

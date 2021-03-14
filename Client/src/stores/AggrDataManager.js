import { observable, action, computed, makeObservable, autorun } from 'mobx';
import ReactFileUploader from '../utilities/Uploader';
import EnsureArray from '../utilities/EnsureArray';
import IsNull from '../utilities/IsNull';

export default class AggrDataManager {

  rootMgr = null;
  fileName = null;
  fileSize = null;
  fileType = null;
  filePath = null;
  dataFiles = [];
  origDataFiles = [];
  rangeYears = null;
  dataFileNameToIdxMap = new Map();
  populationNames = [];
  fileUploadProgress = null;
  actionStatus = null;
  actionMessage = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      fileName: observable,
      fileSize: observable,
      fileType: observable,
      filePath: observable,
      populationNames: observable,
      fileUploadProgress: observable,
      dataFiles: observable,
      origDataFiles: observable,
      rangeYears: observable,
      actionStatus: observable,
      actionMessage: observable,
      dataNames: computed,
      dataNamesString: computed,
      populationNamesString: computed,
      setFileName: action,
      setFileSize: action,
      setFileType: action,
      setFilePath: action,
      setDataFiles: action,
      setDataFileUse: action,
      setDataFileYears: action,
      setPopulationNames: action,
      setFileUploadProgress: action,
      uploadData: action,
      setActionStatus: action,
      setActionMessage: action,
      setRangeYears: action,
      actionValid: computed
    });

    autorun(
      () => this.rootMgr.inputValueSet('aggrFilters:AggrFilters', this.dataFiles),
      { delay: 1000 }
    );
  };

  setFileName = fileName => this.fileName = fileName;
  setFileSize = fileSize => this.fileSize = fileSize;
  setFileType = fileType => this.fileType = fileType;
  setFilePath = filePath => this.filePath = filePath;
  setDataFiles = dataFiles => {
    this.origDataFiles = EnsureArray(dataFiles);
    this.dataFiles = EnsureArray(dataFiles);
    this.dataFileNameToIdxMap = new Map(this.dataFiles.map((el, i) => [el.name, i]));
  };
  setDataFileUse = (name, use) => this.dataFiles[this.dataFileNameToIdxMap.get(name)].use = use;
  setDataFileYears = (name, years) => this.dataFiles[this.dataFileNameToIdxMap.get(name)].years = years;
  setPopulationNames = populationNames => this.populationNames = EnsureArray(populationNames).sort();
  setFileUploadProgress = progress => this.fileUploadProgress = progress;
  setRangeYears = rangeYears => this.rangeYears = rangeYears;

  uploadData = el => {
    var $el = $(el);

    $el.data(
      'currentUploader',
      new ReactFileUploader(
        Shiny.shinyapp,
        el,
        this.setFileUploadProgress
      )
    );
  };

  setActionStatus = status => this.actionStatus = status;
  setActionMessage = message => this.actionMessage = message;

  get dataNames() {
    return this.dataFiles.map(el => el.name);
  };

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

  get actionValid() {
    if (IsNull(this.actionStatus)) {
      return (null);
    } else {
      return this.actionStatus === 'SUCCESS';
    }
  };
}

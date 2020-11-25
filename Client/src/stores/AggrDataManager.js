import { observable, action, computed, makeObservable } from 'mobx';
import EnsureArray from '../utilities/EnsureArray';
import { nonGroupedDataNames } from '../settings'

export default class AggrDataManager {

  rootMgr = null;
  fileName = null;
  fileSize = null;
  fileType = null;
  filePath = null;
  dataFiles = [];
  dataFileNameToIdxMap = new Map();
  populationNames = [];
  fileUploadProgress = null;

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
      dataFilesGrouped: computed,
      dataFilesNonGrouped: computed,
      dataNames: computed,
      dataNamesGrouped: computed,
      dataNamesNonGrouped: computed,
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
      setFileUploadProgress: action
    });
  };

  setFileName = fileName => this.fileName = fileName;
  setFileSize = fileSize => this.fileSize = fileSize;
  setFileType = fileType => this.fileType = fileType;
  setFilePath = filePath => this.filePath = filePath;
  setDataFiles = dataFiles => {
    this.dataFiles = EnsureArray(dataFiles);
    this.dataFileNameToIdxMap = new Map(this.dataFiles.map((el, i) => [el.name, i]));

    const minYear = Math.min.apply(Infinity, this.dataFilesGrouped.map(el => el.years[0]));
    const maxYear = Math.max.apply(-Infinity, this.dataFilesGrouped.map(el => el.years[1]));
    this.setDataFileYears('GROUPED', [minYear, maxYear]);
  }
  setDataFileUse = (name, use) => this.dataFiles[this.dataFileNameToIdxMap.get(name)].use = use;
  setDataFileYears = (name, years) => {
    if (this.dataNamesNonGrouped.includes(name)) {
      this.dataFiles[this.dataFileNameToIdxMap.get(name)].years = years;
    } else {
      this.dataFilesGrouped.forEach(el => el.years = years);
    }
  }
  setPopulationNames = populationNames => this.populationNames = EnsureArray(populationNames).sort();
  setFileUploadProgress = progress => this.fileUploadProgress = progress;

  get dataFilesNonGrouped() {
    return this.dataFiles.filter(el => nonGroupedDataNames.includes(el.name.toUpperCase()));
  };

  get dataFilesGrouped() {
    return this.dataFiles.filter(el => !nonGroupedDataNames.includes(el.name.toUpperCase()));
  };

  get dataNames() {
    return this.dataFiles.map(el => el.name);
  };

  get dataNamesGrouped() {
    return this.dataFilesGrouped.map(el => el.name);
  };

  get dataNamesNonGrouped() {
    return this.dataFilesNonGrouped.map(el => el.name);
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
}

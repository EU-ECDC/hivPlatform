import { observable, action, computed, makeObservable, toJS } from 'mobx';
import EnsureArray from '../utilities/EnsureArray';

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
      dataFiles: observable,
      populationNames: observable,
      fileUploadProgress: observable,
      dataNames: computed,
      dataNamesNonDead: computed,
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
    this.dataFiles = EnsureArray(dataFiles).sort((a, b) => a.name < b.name ? -1 : 1);
    this.dataFileNameToIdxMap = new Map(this.dataFiles.map((el, i) => [el.name, i]));

    const minYear = Math.min.apply(Infinity, this.dataFilesNonDead.map(el => el.years[0]));
    const maxYear = Math.max.apply(-Infinity, this.dataFilesNonDead.map(el => el.years[1]));
    this.setDataFileYears('OTHER', [minYear, maxYear]);
  }
  setDataFileUse = (name, use) => this.dataFiles[this.dataFileNameToIdxMap.get(name)].use = use;
  setDataFileYears = (name, years) => {
    if (name.toUpperCase() === 'DEAD') {
      this.dataFiles[this.dataFileNameToIdxMap.get(name)].years = years;
    } else {
      this.dataFilesNonDead.forEach(el => el.years = years);
    }
  }
  setPopulationNames = populationNames => this.populationNames = EnsureArray(populationNames).sort();
  setFileUploadProgress = progress => this.fileUploadProgress = progress;

  get dataFilesDead() {
    return this.dataFiles.filter(el => el.name.toUpperCase() === 'DEAD');
  };

  get dataFilesNonDead() {
    return this.dataFiles.filter(el => el.name.toUpperCase() !== 'DEAD');
  };

  get dataNames() {
    return this.dataFiles.map(el => el.name);
  };

  get dataNamesNonDead() {
    return this.dataFilesNonDead.map(el => el.name);
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

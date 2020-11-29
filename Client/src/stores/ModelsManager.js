import { observable, action, computed, makeObservable, autorun } from 'mobx';
import TimeIntervalsCollectionManager from './TimeIntervalsCollectionManager';
import LoadTxtFile from '../utilities/LoadTxtFile';

export default class ModelsManager {
  parentMgr = null;
  timeIntCollMgr = null;

  constructor(mgr) {
    this.parentMgr = mgr;
    this.timeIntCollMgr = new TimeIntervalsCollectionManager(this);

    makeObservable(this, {
      modelsParamFile: observable,
      modelsParamFileName: observable,
      modelsParamFileContent: observable,
      minYear: observable,
      maxYear: observable,
      minFitPos: observable,
      maxFitPos: observable,
      minFitCD4: observable,
      maxFitCD4: observable,
      minFitAIDS: observable,
      maxFitAIDS: observable,
      minFitHIVAIDS: observable,
      maxFitHIVAIDS: observable,
      country: observable,
      knotsCount: observable,
      startIncZero: observable,
      distributionFit: observable,
      rDisp: observable,
      delta4Fac: observable,
      maxIncCorr: observable,
      splineType: observable,
      fullData: observable,
      modelsRunProgress: observable,
      modelsRunLog: observable,
      setModelsParamFile: action,
      setModelsParamFileName: action,
      setMinYear: action,
      setMaxYear: action,
      setMinFitPos: action,
      setMaxFitPos: action,
      setMinFitCD4: action,
      setMaxFitCD4: action,
      setMinFitAIDS: action,
      setMaxFitAIDS: action,
      setMinFitHIVAIDS: action,
      setMaxFitHIVAIDS: action,
      setFullData: action,
      setKnotsCount: action,
      setStartIncZero: action,
      setMaxIncCorr: action,
      setDistributionFit: action,
      setDelta4Fac: action,
      setCountry: action,
      setRDisp: action,
      setSplineType: action,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      modelsRunInProgress: computed,
    });

    autorun(() => {
      this.parentMgr.inputValueSet('xmlModel', this.modelsParamFileContent);
    });

    autorun(() => {
      this.timeIntCollMgr.setMinYear(this.minYear);
    });

    autorun(() => {
      this.timeIntCollMgr.setMaxYear(this.maxYear);
    });
  };

  // File details
  modelsParamFile = null;
  modelsParamFileName = '';
  modelsParamFileContent = null;

  // Parameters
  minYear = 1980;
  maxYear = 2016;
  minFitPos = 1979;
  maxFitPos = 1979;
  minFitCD4 = 1984;
  maxFitCD4 = 2016;
  minFitAIDS = 1980;
  maxFitAIDS = 1995;
  minFitHIVAIDS = 1996;
  maxFitHIVAIDS = 2016;
  fullData = true;
  knotsCount = 4;
  startIncZero = true;
  maxIncCorr = true;
  distributionFit = 'POISSON';
  delta4Fac = 0;
  country = 'OTHER';
  rDisp = 50;
  splineType = 'B-SPLINE';

  // Run details
  modelsRunProgress = null;
  modelsRunLog = null;

  setModelsParamFile = paramFile => {
    if (paramFile) {
      this.modelsParamFile = paramFile;
      this.modelsParamFileName = paramFile.name;
      LoadTxtFile(this.modelsParamFile).then(
        action('success', content => this.modelsParamFileContent = content),
        action('error', error => console.log(error))
      );
    }
  };
  setModelsParamFileName = fileName => this.modelsParamFileName = fileName;
  setMinYear = minYear => this.minYear = minYear;
  setMaxYear = maxYear => this.maxYear = maxYear;
  setMinFitPos = minFitPos => this.minFitPos = minFitPos;
  setMaxFitPos = maxFitPos => this.maxFitPos = maxFitPos;
  setMinFitCD4 = minFitCD4 => this.minFitCD4 = minFitCD4;
  setMaxFitCD4 = maxFitCD4 => this.maxFitCD4 = maxFitCD4;
  setMinFitAIDS = minFitAIDS => this.minFitAIDS = minFitAIDS;
  setMaxFitAIDS = maxFitAIDS => this.maxFitAIDS = maxFitAIDS;
  setMinFitHIVAIDS = minFitHIVAIDS => this.minFitHIVAIDS = minFitHIVAIDS;
  setMaxFitHIVAIDS = maxFitHIVAIDS => this.maxFitHIVAIDS = maxFitHIVAIDS;
  setFullData = fullData => this.fullData = fullData;
  setKnotsCount = knotsCount => this.knotsCount = knotsCount;
  setStartIncZero = startIncZero => this.startIncZero = startIncZero;
  setMaxIncCorr = maxIncCorr => this.maxIncCorr = maxIncCorr;
  setDistributionFit = distributionFit => this.distributionFit = distributionFit;
  setDelta4Fac = delta4Fac => this.delta4Fac = delta4Fac;
  setCountry = country => this.country = country;
  setRDisp = rDisp => this.rDisp = rDisp;
  setSplineType = splineType => this.splineType = splineType;

  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  runModels = () => this.parentMgr.btnClicked('runModelBtn:HIVModelParams', {
    minYear: this.minYear,
    maxYear: this.maxYear,
    minFitPos: this.minFitPos,
    maxFitPos: this.maxFitPos,
    minFitCD4: this.minFitCD4,
    maxFitCD4: this.maxFitCD4,
    minFitAIDS: this.minFitAIDS,
    maxFitAIDS: this.maxFitAIDS,
    minFitHIVAIDS: this.minFitHIVAIDS,
    maxFitHIVAIDS: this.maxFitHIVAIDS,
    fullData: this.fullData,
    knotsCount: this.knotsCount,
    startIncZero: this.startIncZero,
    maxIncCorr: this.maxIncCorr,
    distributionFit: this.distributionFit,
    delta4Fac: this.delta4Fac,
    country: this.country,
    rDisp: this.rDisp,
    splineType: this.splineType,
    timeIntervals: this.timeIntCollMgr.selectedRunCollection.intervals,
    popCombination: this.parentMgr.popCombMgr.selectedCombination
  });
  cancelModels = () => this.parentMgr.btnClicked('cancelModelBtn');

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

}

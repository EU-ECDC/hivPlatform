import { observable, action, computed, makeObservable, autorun, toJS } from 'mobx';
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

      rangeYears: observable,
      optimalYears: observable,

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
      fullData: observable,
      knotsCount: observable,
      startIncZero: observable,
      maxIncCorr: observable,
      distributionFit: observable,
      delta4Fac: observable,
      country: observable,

      modelsRunProgress: observable,
      modelsRunLog: observable,
      bootstrapRunProgress: observable,
      bootstrapRunLog: observable,
      bootstrapCount: observable,
      bootstrapType: observable,
      plotData: observable,
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
      setBootstrapCount: action,
      setBootstrapType: action,
      setRangeYears: action,
      setOptimalYears: action,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      runBootstrap: action,
      cancelBootstrap: action,
      modelsRunInProgress: computed,
      bootstrapRunInProgress: computed,
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

  // Parameters
  rangeYears = null;
  optimalYears = null;

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
  bootstrapCount = 100;
  bootstrapType = 'PARAMETRIC';

  // Run details
  modelsRunProgress = null;
  modelsRunLog = null;
  bootstrapRunProgress = null;
  bootstrapRunLog = null;

  plotData = null;

  setModelsParamFile = paramFile => {
    if (paramFile) {
      this.modelsParamFile = paramFile;
      this.modelsParamFileName = paramFile.name;
      LoadTxtFile(this.modelsParamFile).then(
        action('success', content => {
          this.parentMgr.btnClicked('xmlModel', content);
        }),
        action('error', error => console.log(error))
      );
    }
  };
  setModelsParamFileName = fileName => this.modelsParamFileName = fileName;
  setRangeYears = rangeYears => this.rangeYears = rangeYears;
  setOptimalYears = optimalYears => {
    this.optimalYears = optimalYears;
    this.setMinYear(optimalYears.All[0]);
    this.setMaxYear(optimalYears.All[1]);
    this.setMinFitPos(optimalYears.HIV[0]);
    this.setMaxFitPos(optimalYears.HIV[1]);
    this.setMinFitCD4(optimalYears.HIVCD4[0]);
    this.setMaxFitCD4(optimalYears.HIVCD4[1]);
    this.setMinFitAIDS(optimalYears.AIDS[0]);
    this.setMaxFitAIDS(optimalYears.AIDS[1]);
    this.setMinFitHIVAIDS(optimalYears.HIVAIDS[0]);
    this.setMaxFitHIVAIDS(optimalYears.HIVAIDS[1]);
  };
  setMinYear = minYear =>
    this.minYear = Math.min(Math.max(this.optimalYears.All[0] - 1, minYear), this.optimalYears.All[1]);
  setMaxYear = maxYear =>
    this.maxYear = Math.min(Math.max(this.optimalYears.All[0] - 1, maxYear), this.optimalYears.All[1]);
  setMinFitPos = minFitPos =>
    this.minFitPos = Math.min(Math.max(this.optimalYears.All[0] - 1, minFitPos), this.optimalYears.All[1]);
  setMaxFitPos = maxFitPos =>
    this.maxFitPos = Math.min(Math.max(this.optimalYears.All[0] - 1, maxFitPos), this.optimalYears.All[1]);
  setMinFitCD4 = minFitCD4 =>
    this.minFitCD4 = Math.min(Math.max(this.optimalYears.All[0] - 1, minFitCD4), this.optimalYears.All[1]);
  setMaxFitCD4 = maxFitCD4 =>
    this.maxFitCD4 = Math.min(Math.max(this.optimalYears.All[0] - 1, maxFitCD4), this.optimalYears.All[1]);
  setMinFitAIDS = minFitAIDS =>
    this.minFitAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, minFitAIDS), this.optimalYears.All[1]);
  setMaxFitAIDS = maxFitAIDS =>
    this.maxFitAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, maxFitAIDS), this.optimalYears.All[1]);
  setMinFitHIVAIDS = minFitHIVAIDS =>
    this.minFitHIVAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, minFitHIVAIDS), this.optimalYears.All[1]);
  setMaxFitHIVAIDS = maxFitHIVAIDS =>
    this.maxFitHIVAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, maxFitHIVAIDS), this.optimalYears.All[1]);
  setFullData = fullData => this.fullData = fullData;
  setKnotsCount = knotsCount => this.knotsCount = knotsCount;
  setStartIncZero = startIncZero => this.startIncZero = startIncZero;
  setMaxIncCorr = maxIncCorr => this.maxIncCorr = maxIncCorr;
  setDistributionFit = distributionFit => this.distributionFit = distributionFit;
  setDelta4Fac = delta4Fac => this.delta4Fac = delta4Fac;
  setCountry = country => this.country = country;
  setBootstrapCount = bootstrapCount => this.bootstrapCount = bootstrapCount;
  setBootstrapType = bootstrapType => this.bootstrapType = bootstrapType;
  setPlotData = plotData => this.plotData = plotData;

  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  runModels = () => {
    const params = {
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
      timeIntervals: toJS(this.timeIntCollMgr.selectedRunCollection.intervals),
      popCombination: toJS(this.parentMgr.popCombMgr.selectedCombination)
    };
    this.parentMgr.btnClicked('runModelBtn:HIVModelParams', params);
  };

  cancelModels = () => this.parentMgr.btnClicked('cancelModelBtn');

  setBootstrapRunProgress = progress => this.bootstrapRunProgress = progress;

  setBootstrapRunLog = runLog => this.bootstrapRunLog = runLog;

  runBootstrap = () => this.parentMgr.btnClicked('runBootstrapBtn', {
    count: this.bootstrapCount,
    type: this.bootstrapType
  });

  cancelBootstrap = () => this.parentMgr.btnClicked('cancelBootstrapBtn');

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

  get bootstrapRunInProgress() {
    return this.bootstrapRunProgress !== null;
  };
}

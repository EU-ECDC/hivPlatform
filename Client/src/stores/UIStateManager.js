import { observable, action, computed, makeObservable } from 'mobx';
import { EVENT_TO_ENABLED_STAGES_MAP } from '../settings';

export default class UIStateManager {

  lastEventType = 'START';

  rootMgr = null;

  steps = [
    { title: 'Welcome', completed: false, disabled: false, subSteps: [] },
    {
      title: 'Input data upload',
      completed: false,
      disabled: false,
      subSteps: [
        { title: 'Case-based data', disabled: false },
        { title: 'Aggregated data', disabled: true }
      ],
      activeSubStepId: 0
    },
    { title: 'Case-based data summary', completed: false, disabled: true, subSteps: [] },
    {
      title: 'Adjustments',
      completed: false,
      disabled: true,
      subSteps: [
        { title: 'Inputs' },
        { title: 'Run' },
      ],
      activeSubStepId: 0
    },
    {
      title: 'Modelling',
      completed: false,
      disabled: true,
      subSteps: [
        { title: 'Populations' },
        { title: 'Inputs' },
        { title: 'Advanced' },
        { title: 'Run Main Fit' },
        { title: 'Run Bootstrap' },
        { title: 'Tables and charts' }
      ],
      activeSubStepId: 0
    },
    { title: 'Reports', completed: false, disabled: true, subSteps: [] },
    { title: 'Outputs', completed: false, disabled: true, subSteps: [] },
  ];

  activeStepId = 0;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      steps: observable,
      stepsTitles: computed,
      activeStepId: observable,
      setActiveStepId: action,
      setActiveSubStepId: action,
      lastEventType: observable,
      setLastEventType: action,
      enabledStages: computed,
      caseBasedUploadStageEnabled: computed,
      caseBasedAttrMappingStageEnabled: computed,
      caseBasedOrigGrpngStageEnabled: computed,
    });
  };

  get stepsTitles() {
    const stepTitles = this.steps.map(step => step.title);
    return stepTitles;
  };

  setActiveStepId = stepId => {
    this.steps[stepId].disabled = false;
    if (stepId > 0) {
      this.steps[stepId - 1].completed = true;
    }
    this.activeStepId = stepId;
  };

  setActiveSubStepId = (stepId, subStepId) => {
    this.setActiveStepId(stepId);
    this.steps[stepId].activeSubStepId = subStepId;
  };

  setLastEventType = eventType => {
    console.log(eventType);
    this.lastEventType = eventType;

    // Welcome
    // this.steps[0].disabled = false;

    // Data upload
    // this.steps[1].disabled =

    // Case-based summary
    this.steps[2].disabled = !this.caseBasedSummaryStageEnabled;

    // Adjustments
    this.steps[3].disabled = !this.caseBasedAdjustmentsStageEnabled;

    // switch (eventType) {
    //   // case 'AGGR_DATA_UPLOADED':
    //   //   this.steps[4].disabled = false;
    //   //   break;
    //   // case 'SUMMARY_DATA_PREPARED':
    //   //   this.steps[2].disabled = false;
    //   //   break;
    //   case 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED':
    //     this.steps[2].disabled = !this.caseBasedSummaryStageEnabled;
    //     this.steps[3].disabled = !this.caseBasedSummaryStageEnabled;
    //     break;
    // }
  };

  get enabledStages() {
    return EVENT_TO_ENABLED_STAGES_MAP[this.lastEventType];
  };

  get caseBasedUploadStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_UPLOAD') !== -1;
  };

  get caseBasedAttrMappingStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ATTR_MAPPING') !== -1;
  };

  get caseBasedOrigGrpngStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ORIGIN_GROUPING') !== -1;
  };

  get caseBasedSummaryStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_SUMMARY') !== -1;
  };

  get caseBasedAdjustmentsStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ADJUSTMENTS') !== -1;
  };
}

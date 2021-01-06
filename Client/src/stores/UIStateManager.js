import { observable, action, computed, makeObservable } from 'mobx';
import { EVENT_TO_ENABLED_STAGES_MAP } from '../settings';

export default class UIStateManager {

  lastEventType = 'START';

  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      lastEventType: observable,
      setLastEventType: action,
      enabledStages: computed,
      caseBasedUploadStageEnabled: computed,
      caseBasedAttrMappingStageEnabled: computed,
      caseBasedOrigGrpngStageEnabled: computed,
    });
  };

  setLastEventType = eventType => {
    console.log('UIStateManager:setLastEventType', eventType);
    this.lastEventType = eventType;
  }

  get enabledStages() {
    return EVENT_TO_ENABLED_STAGES_MAP[this.lastEventType];
  };

  get caseBasedUploadStageEnabled() {
    console.log(this.enabledStages);
    // return this.enabledStages.indexOf('CASE_BASED_UPLOAD') !== -1;
    return false;
  };

  get caseBasedAttrMappingStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ATTR_MAPPING') !== -1;
  };

  get caseBasedOrigGrpngStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ORIGIN_GROUPING') !== -1;
  };
}

import { observable, action, computed } from 'mobx';
import { EVENT_TO_ENABLED_STAGES_MAP } from '../settings';

export default class UIStateManager {

  @observable
  lastEventType = 'START';

  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action setLastEventType = eventType => this.lastEventType = eventType;

  @computed
  get enabledStages() {
    return EVENT_TO_ENABLED_STAGES_MAP[this.lastEventType];
  };

  @computed
  get caseBasedUploadStageEnabled() {
    return this.enabledStages.indexOf['CASE_BASED_UPLOAD'] !== -1;
  };

  @computed
  get caseBasedAttrMappingStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ATTR_MAPPING') !== -1;
  };

  @computed
  get caseBasedOrigGrpngStageEnabled() {
    return this.enabledStages.indexOf('CASE_BASED_ORIGIN_GROUPING') !== -1;
  };

}

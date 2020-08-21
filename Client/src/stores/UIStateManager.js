import { observable, action, computed } from 'mobx';
import { EVENT_TO_ENABLED_STAGES_MAP } from '../settings';

export default class UIStateManager {

  @observable
  lastEvent = 'START';

  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action setLastEvent = event => this.lastEvent = event;

  @computed
  get enabledStages() {
    return EVENT_TO_ENABLED_STAGES_MAP[this.lastEvent];
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

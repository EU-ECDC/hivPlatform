import { observable, computed, action, toJS } from 'mobx';

export default class AttrMappingManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  }

  observable
  mapping = null;

  @observable
  meta = {
    valid: false,
    msg: 'dfsdf',
  };

  @action setMapping = mapping => this.mapping = mapping;
  @action setMeta = meta => this.meta = meta;

  @computed
  get mappingArray() {
    if (this.mapping === null) {
      return [];
    } else {
      const mapping = toJS(this.mapping);
      return Object.entries(mapping).map(
        el => ({ Key: el[0], Val: el[1] })
      );
    }
  };

}

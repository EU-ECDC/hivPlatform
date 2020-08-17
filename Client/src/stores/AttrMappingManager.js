import { observable, action, toJS } from 'mobx';

export default class AttrMappingManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  }

  @observable
  mapping = [];

  attrToIdxMap = {};

  @observable
  valid = true;

  @observable
  msg = 'Mapping is valid';

  @action setMapping = mapping => {
    this.mapping = mapping;
    this.validateMapping();
  };

  @action setOrigCol = (attribute, origCol) => {
    const idx = this.mapping.findIndex(el => el.Attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].OrigColName = origCol !== '' ? origCol : null;
      this.validateMapping();
    } else {
      console.log(`AttrMappingManager.setOrigCol: cannot find element with Attribute "${attribute}"`)
    }
  };

  @action setDefVal = (attribute, defVal) => {
    const idx = this.mapping.findIndex(el => el.Attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].DefVal = defVal !== '' ? defVal : null;
    } else {
      console.log(`AttrMappingManager.setDefVal: cannot find element with Attribute "${attribute}"`)
    }
  };

  @action applyMapping = () => {
    this.rootMgr.inputValueSet('attrMapping:AttrMappingArray', this.mapping);
  }

  validateMapping = () => {
    const counts = this.mapping
      .filter(el => el.OrigColName) // Filter nulls
      .map(el => el.OrigColName)
      .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    const multipleMappedColumns = [...counts].filter(el => el[1] > 1).map(el => el[0]);

    if (multipleMappedColumns.length > 0) {
      this.valid = false;
      this.msg = `Column${multipleMappedColumns.length > 1 ? 's' : ''} "${multipleMappedColumns.join(', ')}" ${multipleMappedColumns.length > 1 ? 'are' : 'is'} mapped multiple times`;
    } else {
      this.valid = true;
      this.msg = 'Mapping is valid'
    }
  };
}

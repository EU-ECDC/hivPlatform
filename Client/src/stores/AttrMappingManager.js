import { observable, action, makeObservable } from 'mobx';

export default class AttrMappingManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      mapping: observable,
      status: observable,
      msg: observable,
      setMapping: action,
      setOrigCol: action,
      setDefVal: action,
      applyMapping: action,
      setStatus: action,
      setMsg: action
    });
  }

  mapping = [];
  status = true;
  msg = null;

  setMapping = mapping => {
    this.mapping = mapping;
    this.validateMapping();
  };

  setMsg = msg => this.msg = msg;

  setStatus = status => this.status = status;

  setOrigCol = (attribute, origCol) => {
    const idx = this.mapping.findIndex(el => el.attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].origColName = origCol !== '' ? origCol : null;
      this.validateMapping();
    } else {
      console.log(`AttrMappingManager.setOrigCol: cannot find element with Attribute "${attribute}"`)
    }
  };

  setDefVal = (attribute, defVal) => {
    const idx = this.mapping.findIndex(el => el.attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].defaultValue = defVal !== '' ? defVal : null;
    } else {
      console.log(`AttrMappingManager.setDefVal: cannot find element with Attribute "${attribute}"`)
    }
  };

  applyMapping = () => {
    this.rootMgr.inputValueSet('attrMapping', this.mapping);
  }

  validateMapping = () => {
    const counts = this.mapping
      .filter(el => el.origColName) // Filter nulls
      .map(el => el.origColName)
      .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    const multipleMappedColumns = [...counts].filter(el => el[1] > 1).map(el => el[0]);

    let msg = null;
    let status = null;
    if (multipleMappedColumns.length > 0) {
      status = 'FAIL';
      msg = `Column${multipleMappedColumns.length > 1 ? 's' : ''} "${multipleMappedColumns.join(', ')}" ${multipleMappedColumns.length > 1 ? 'are' : 'is'} mapped multiple times`;
      this.setMsg()
    } else {
      status = 'SUCCESS';
      msg = 'Attribute mapping is valid';
    }
    this.setStatus(status);
    this.setMsg(msg);
  };
}

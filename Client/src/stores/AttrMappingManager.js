import { observable, action, computed, makeObservable } from 'mobx';
import IsNull from '../utilities/IsNull';

export default class AttrMappingManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      mapping: observable,
      actionStatus: observable,
      actionMessage: observable,
      setMapping: action,
      setOrigCol: action,
      setDefVal: action,
      applyMapping: action,
      setActionStatus: action,
      setActionMessage: action,
      actionValid: computed
    });
  }

  mapping = [];
  actionStatus = null;
  actionMessage = null;

  setMapping = mapping => {
    this.mapping = mapping;
    this.runCheck();
  };

  setActionStatus = status => this.actionStatus = status;

  setActionMessage = message => this.actionMessage = message;

  // Set mapping from original column to attribute
  setOrigCol = (attribute, origCol) => {
    const idx = this.mapping.findIndex(el => el.attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].origColName = origCol !== '' ? origCol : null;
      this.runCheck();
    } else {
      console.log(`AttrMappingManager.setOrigCol: cannot find element with Attribute "${attribute}"`)
    }
  };

  // Set default value for attribute
  setDefVal = (attribute, defVal) => {
    const idx = this.mapping.findIndex(el => el.attribute === attribute);
    if (idx !== -1) {
      this.mapping[idx].defaultValue = defVal !== '' ? defVal : null;
    } else {
      console.log(`AttrMappingManager.setDefVal: cannot find element with Attribute "${attribute}"`)
    }
  };

  // Apply mapping in server
  applyMapping = () => {
    this.rootMgr.inputValueSet('attrMapping:AttrMappingArray', this.mapping);
  }

  // Check mapping in client
  runCheck = () => {
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
    } else {
      status = 'SUCCESS';
      msg = 'Attribute mapping is valid';
    }
    this.setActionStatus(status);
    this.setActionMessage(msg);
  };

  get actionValid() {
    if (IsNull(this.actionStatus)) {
      return (null);
    } else {
      return this.actionStatus === 'SUCCESS';
    }
  };
}

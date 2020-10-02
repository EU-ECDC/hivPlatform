import { observable, computed, action, makeObservable } from 'mobx';
import GenerateId from '../utilities/GenerateId';

export default class NotificationsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      msgInfo: observable,
      setMsg: action,
      clearMsg: action,
      hasMsg: computed,
    });
  }

  msgInfo = {
    key: null,
    msg: null,
  };

  setMsg = msg => {
    this.msgInfo = {
      msg,
      key: GenerateId('msg'),
    };
  };

  clearMsg = () => {
    this.msgInfo = {
      key: null,
      msg: null,
    };
  };

  get hasMsg() {
    return this.msgInfo.msg !== null;
  }
}

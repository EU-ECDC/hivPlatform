import { observable, computed, action, makeObservable } from 'mobx';
import GenerateId from '../utilities/GenerateId';

export default class NotificationsManager {
  rootMgr = null;

  msgInfo = {
    key: null,
    msg: null,
  };

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      msgInfo: observable,
      hasMsg: computed,
      setMsg: action,
      clearMsg: action,
      setUIState: action
    });
  }

  get hasMsg() {
    return this.msgInfo.msg !== null;
  }

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

  setUIState = uiState => {
    this.msgInfo = uiState.msgInfo;
  };
}

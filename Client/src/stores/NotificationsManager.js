import { observable, computed, action } from 'mobx';
import GenerateId from '../utilities/GenerateId';

export default class NotificationsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  }

  @observable
  msgInfo = {
    key: null,
    msg: null,
  };

  @action
  setMsg = msg => {
    this.msgInfo = {
      msg,
      key: GenerateId('msg'),
    };
  };

  @action
  clearMsg = () => {
    this.msgInfo = {
      key: null,
      msg: null,
    };
  };

  @computed
  get hasMsg() {
    return this.msgInfo.msg !== null;
  }
}

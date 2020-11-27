import { observable, action, makeObservable } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';

export default class TimeIntervalsCollectionManager {
  parentMgr = null;

  constructor(mgr) {
    this.parentMgr = mgr;

    makeObservable(this, {
      collections: observable,
      setMinYear: action,
      setMaxYear: action,
    });
  }

  collections = new Map();

  setMinYear = minYear => { };

  setMaxYear = maxYear => { };

  add = (name, intervals, minYear, maxYear) => {

  };
};

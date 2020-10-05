import { observable, computed, action, toJS, makeObservable } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';

export default class TimeIntervalsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      intervals: observable,
      minYear: observable,
      maxYear: observable,
      addEmptyInterval: action,
      removeIntervals: action,
      setIntervalStartYear: action,
      setIntervalJump: action,
      setIntervalChangeInInterval: action,
      setIntervalDiffByCD4: action,
      intervalsJS: computed,
    });
  };

  intervals = [];

  minYear = 1980;

  maxYear = 2018;

  addEmptyInterval = () => {
    this.intervals.push({
      startYear: this.minYear,
      endYear: this.maxYear,
      jump: false,
      changeInInterval: false,
      diffByCD4: false,
    });
  };

  removeIntervals = selectedIds => {
    this.intervals = RemoveElementsFromArray(this.intervals, selectedIds);
  };

  setIntervalStartYear = (i, startYear) => this.intervals[i].startYear = startYear;
  setIntervalJump = (i, jump) => this.intervals[i].jump = jump;
  setIntervalChangeInInterval = (i, change) => this.intervals[i].changeInInterval = change;
  setIntervalDiffByCD4 = (i, diff) => this.intervals[i].diffByCD4 = diff;

  get intervalsJS() {
    return toJS(this.intervals);
  };
}

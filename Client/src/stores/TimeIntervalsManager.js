import { observable, computed, action, toJS, makeObservable } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import GenerateId from '../utilities/GenerateId';
import IsNull from '../utilities/IsNull';

export default class TimeIntervalsManager {
  parentMgr = null;

  constructor(mgr, name, intervals = null) {
    this.parentMgr = mgr;
    this.id = GenerateId('timeIntervals');
    this.name = name;
    this.minYear = mgr.minYear;
    this.maxYear = mgr.maxYear;
    if (IsNull(intervals)) {
      this.createIntervals(this.minYear, this.maxYear, 5, 1984)
    } else {
      this.intervals = intervals;
    }
    makeObservable(this, {
      id: observable,
      name: observable,
      intervals: observable,
      minYear: observable,
      maxYear: observable,
      setMinYear: action,
      setMaxYear: action,
      setIntervals: action,
      addInterval: action,
      addEmptyInterval: action,
      removeIntervals: action,
      setId: action,
      setName: action,
      setIntervalStartYear: action,
      setIntervalJump: action,
      setIntervalChangeInInterval: action,
      setIntervalDiffByCD4: action,
      intervalsJS: computed,
      maxStartYear: computed,
    });
  };

  id = null;

  name = '';

  intervals = [];

  minYear = null;

  maxYear = null;

  setId = id => this.id = id;

  setName = name => this.name = name;

  setMinYear = minYear => {
    this.minYear = minYear;
    this.intervals.forEach(el => el.startYear = Math.max(this.minYear, el.startYear));
    this.reinitializeEndYears();
  };

  setMaxYear = maxYear => {
    this.maxYear = maxYear;
    this.reinitializeEndYears();
  };

  setIntervals = (minYear, maxYear, intervals) => {
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.intervals = intervals;
  };

  createIntervals = (minYear, maxYear, numIntervals, firstIntervalEndYear = 0) => {
    if (numIntervals > 0) {
      this.minYear = minYear;
      this.maxYear = maxYear;
      let lastEndYear = minYear;
      for (let i = 0; i < numIntervals; ++i) {
        let startYear = lastEndYear;
        const step = Math.max(Math.floor((maxYear - startYear) / (numIntervals - i)), 1);
        let endYear = Math.min(startYear + step, maxYear);

        if ((i === 0) && (firstIntervalEndYear > 0) && (firstIntervalEndYear >= minYear)) {
          startYear = minYear;
          endYear = firstIntervalEndYear;
        }

        this.addInterval(startYear, endYear, i !== 0, false, false);

        lastEndYear = endYear;

        if (endYear === maxYear) {
          break;
        }
      }
    }
  };

  addInterval = (startYear, endYear, jump, changeInInterval, diffByCD4) => {
    this.intervals.push({startYear, endYear, jump, changeInInterval, diffByCD4});
  };

  addEmptyInterval = () => {
    this.addInterval(this.maxStartYear, this.maxYear, false, false, false);
    this.reinitializeEndYears();
  };

  removeIntervals = selectedIds => {
    if (selectedIds.length === this.intervals.length) {
      selectedIds = RemoveElementsFromArray(selectedIds, 0);
    }
    this.intervals = RemoveElementsFromArray(this.intervals, selectedIds);
    this.reinitializeEndYears();
  };

  setIntervalStartYear = (i, startYear) => {
    if (startYear >= this.minYear && startYear <= this.maxYear) {
      this.intervals[i].startYear = startYear;
      this.reinitializeEndYears();
    }
  }
  setIntervalJump = (i, jump) => this.intervals[i].jump = jump;
  setIntervalChangeInInterval = (i, change) => this.intervals[i].changeInInterval = change;
  setIntervalDiffByCD4 = (i, diff) => this.intervals[i].diffByCD4 = diff;

  get intervalsJS() {
    return toJS(this.intervals);
  };

  get maxStartYear() {
    if (this.intervals.length === 0) {
      return this.minYear;
    } else {
      return Math.max.apply(null, this.intervals.map(el => el.startYear));
    }
  };

  reinitializeEndYears = () => {
    const numIntervals = this.intervals.length;
    if (numIntervals > 0) {
      this.intervals[0].startYear = this.minYear;
      this.intervals.sort((a, b) => a.startYear < b.startYear ? -1 : 1);
      for (let i = 0; i < numIntervals; ++i) {
        this.intervals[i].startYear = Math.min(this.intervals[i].startYear, this.maxYear);
        if (i !== (numIntervals - 1)) {
          this.intervals[i].endYear = Math.min(this.intervals[i + 1].startYear, this.maxYear);
        }
      }
      this.intervals[numIntervals - 1].endYear = this.maxYear;
    }
  };
}

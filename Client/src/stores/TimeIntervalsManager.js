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
      setIntervals: action,
      addEmptyInterval: action,
      removeIntervals: action,
      setIntervalStartYear: action,
      setIntervalJump: action,
      setIntervalChangeInInterval: action,
      setIntervalDiffByCD4: action,
      intervalsJS: computed,
      maxStartYear: computed,
    });

    // this.createIntervals(1980, 2018, 4, 1984);
  };

  intervals = [];

  minYear = null;

  maxYear = null;

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
        let step = Math.max(Math.floor((maxYear - startYear) / (numIntervals - i)), 1);
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

  addEmptyInterval = () => {
    this.intervals.push({
      startYear: this.maxStartYear,
      endYear: this.maxYear,
      jump: false,
      changeInInterval: false,
      diffByCD4: false,
    });
    this.reinitializeEndYears();
  };

  addInterval = (startYear, endYear, jump, changeInInterval, diffByCD4) => {
    this.intervals.push({startYear, endYear, jump, changeInInterval, diffByCD4});
  };

  removeIntervals = selectedIds => {
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
    let numIntervals = this.intervals.length;
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
  }
}

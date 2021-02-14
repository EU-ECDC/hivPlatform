import { observable, action, makeObservable, computed, autorun, keys, values } from 'mobx';
import TimeIntervalsManager from './TimeIntervalsManager';
import IsNull from '../utilities/IsNull';
import GetNextId from '../utilities/GetNextId';

export default class TimeIntervalsCollectionManager {
  parentMgr = null;

  constructor(mgr) {
    this.parentMgr = mgr;
    this.minYear = mgr.minYear;
    this.maxYear = mgr.maxYear;

    this.addNewCollection();
    this.selectedRunCollectionId = this.selectedEditCollection.id;

    makeObservable(this, {
      minYear: observable,
      maxYear: observable,
      collections: observable,
      selectedEditCollectionId: observable,
      selectedRunCollectionId: observable,
      setIntervals: action,
      setMinYear: action,
      setMaxYear: action,
      addNewCollection: action,
      setSelectedEditCollectionId: action,
      setSelectedRunCollectionId: action,
      deleteSelectedEditCollection: action,
      selectedEditCollection: computed,
      selectedRunCollection: computed,
      collectionsArray: computed,
      defaultEditCollectionSelected: computed,
      collectionsNames: computed,
    });

    autorun(() => {
      this.collections.forEach(el => el.setMinYear(this.minYear));
    });

    autorun(() => {
      this.collections.forEach(el => el.setMaxYear(this.maxYear));
    });
  }

  collections = new Map();

  minYear = null;

  maxYear = null;

  selectedEditCollectionId = null;

  selectedRunCollectionId = null;

  setIntervals = (minYear, maxYear, intervals) => {
    if (!IsNull(this.selectedEditCollection)) {
      this.selectedEditCollection.setIntervals(minYear, maxYear, intervals);
    }
  };

  setMinYear = minYear => this.minYear = minYear;

  setMaxYear = maxYear => this.maxYear = maxYear;

  addNewCollection = (name = null, intervals = null) => {
    if (IsNull(name)) {
      if (this.collections.size === 0) {
        name = 'Default';
      } else {
        name = `Set ${GetNextId('Set ', this.collectionsNames)}`;
      }
    }
    const collection = new TimeIntervalsManager(this, name, intervals);
    this.collections.set(
      collection.id,
      collection
    );
    this.selectedEditCollectionId = collection.id;
  };

  deleteSelectedEditCollection = () => {
    if (this.collections.has(this.selectedEditCollectionId)) {
      this.collections.delete(this.selectedEditCollectionId);
    }
    const ids = keys(this.collections);
    this.selectedEditCollectionId = ids[ids.length - 1];
  };

  setSelectedEditCollectionId = id => {
    this.selectedEditCollectionId = id;
  };

  setSelectedRunCollectionId = id => {
    this.selectedRunCollectionId = id;
  };

  get selectedEditCollection() {
    let result = null;
    if (this.collections.has(this.selectedEditCollectionId)) {
      result = this.collections.get(this.selectedEditCollectionId);
    }
    return result;
  };

  get selectedRunCollection() {
    let result = null;
    if (this.collections.has(this.selectedRunCollectionId)) {
      result = this.collections.get(this.selectedRunCollectionId);
    }
    return result;
  };

  get defaultEditCollectionSelected() {
    return this.selectedEditCollection.name.toUpperCase() === 'DEFAULT';
  };

  get collectionsArray() {
    return values(this.collections);
  };

  get collectionsNames() {
    return this.collectionsArray.map(el => el.name);
  };

};

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

    this.addCollection();

    makeObservable(this, {
      collections: observable,
      selectedCollectionId: observable,
      minYear: observable,
      maxYear: observable,
      setMinYear: action,
      setMaxYear: action,
      addCollection: action,
      setSelectedCollectionId: action,
      deleteSelectedCollection: action,
      selectedCollection: computed,
      collectionsArray: computed,
      defaultSelected: computed,
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

  minYear = 1980;

  maxYear = 2016;

  selectedCollectionId = null;

  setMinYear = minYear => this.minYear = minYear;

  setMaxYear = maxYear => this.maxYear = maxYear;

  addCollection = (name = null, intervals = null) => {
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
    this.selectedCollectionId = collection.id;
  };

  deleteSelectedCollection = () => {
    if (this.collections.has(this.selectedCollectionId)) {
      this.collections.delete(this.selectedCollectionId);
    }
    const ids = keys(this.collections);
    this.selectedCollectionId = ids[ids.length - 1];
  };

  setSelectedCollectionId = id => {
    this.selectedCollectionId = id;
  };

  get selectedCollection() {
    let result = null;
    if (this.collections.has(this.selectedCollectionId)) {
      result = this.collections.get(this.selectedCollectionId);
    }
    return result;
  };

  get defaultSelected() {
    return this.selectedCollection.name.toUpperCase() === 'DEFAULT';
  };

  get collectionsArray() {
    return values(this.collections);
  };

  get collectionsNames() {
    return this.collectionsArray.map(el => el.name);
  };

};

import { observable, computed, action, toJS, makeObservable, autorun } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import GetNextId from '../utilities/GetNextId';

export default class PopCombinationsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      combinations: observable,
      addEmptyCombination: action,
      removeCombinations: action,
      setCombinationName: action,
      setCombinationPopulations: action,
      filterPopulations: action,
      combinationsJS: computed,
      combinationsNames: computed,
    });

    autorun(() => {
      this.filterPopulations(this.rootMgr.popMgr.definedPopulations);
    });
  }

  combinations = [];

  addEmptyCombination = () => {
    this.combinations.push({
      name: `Combination ${GetNextId('Combination ', this.combinationsNames)}`,
      populations: []
    });
  };

  removeCombinations = selectedIds => {
    this.combinations = RemoveElementsFromArray(this.combinations, selectedIds);
  };

  setCombinationName = (i, name) => {
    this.combinations[i].name = name;
  };

  setCombinationPopulations = (i, populations) => {
    this.combinations[i].populations = populations;
  };

  filterPopulations = (definedPopulations) =>
    this.combinations.forEach(el => { el.populations = el.populations.filter(value => definedPopulations.includes(value)) });

  get combinationsJS() {
    return toJS(this.combinations);
  };

  get combinationsNames() {
    return this.combinations.map(el => el.name);
  };

}

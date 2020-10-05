import { observable, computed, action, toJS, makeObservable, autorun } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';

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
    });

    autorun(() => {
      this.filterPopulations(this.rootMgr.popMgr.definedPopulations);
    });
  }

  combinations = [];

  addEmptyCombination = () => {
    this.combinations.push({
      name: 'Combination',
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

  get combinationsJS() {
    return toJS(this.combinations);
  };

  filterPopulations = (definedPopulations) =>
    this.combinations.forEach(el => { el.populations = el.populations.filter(value => definedPopulations.includes(value)) });

}

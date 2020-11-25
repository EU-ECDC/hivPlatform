import { observable, computed, action, toJS, makeObservable, autorun } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import GetNextId from '../utilities/GetNextId';

export default class PopCombinationsManager {
  parentMgr = null;

  constructor(mgr) {
    this.parentMgr = mgr;
    makeObservable(this, {
      combinations: observable,
      selectedCombinationName: observable,
      addEmptyCombination: action,
      removeCombinations: action,
      setCombinationName: action,
      setSelectedCombinationName: action,
      setCombinationPopulations: action,
      setAggrCombinationPopulations: action,
      syncPopulations: action,
      syncAggrPopulations: action,
      combinationAll: computed,
      combinationsJS: computed,
      combinationsNames: computed,
      aggrCombinationsJS: computed,
    });

    this.combinations.push({
      name: 'ALL',
      populations: [],
      aggrPopulations: [],
    });

    this.setSelectedCombinationName('ALL');

    autorun(() => {
      this.syncPopulations(this.parentMgr.popMgr.definedPopulations);
    });

    autorun(() => {
      this.syncAggrPopulations(this.parentMgr.aggrDataMgr.populationNames);
    });
  }

  combinations = [];
  selectedCombinationName = '';

  addEmptyCombination = () => {
    this.combinations.push({
      name: `Combination ${GetNextId('Combination ', this.combinationsNames)}`,
      populations: [],
      aggrPopulations: []
    });
  };

  removeCombinations = selectedIds => {
    this.combinations = RemoveElementsFromArray(this.combinations, selectedIds);
  };

  setSelectedCombinationName = combName => {
    this.selectedCombinationName = combName;
  }

  setCombinationName = (i, name) => {
    this.combinations[i].name = name;
  };

  setCombinationPopulations = (i, populations) => {
    this.combinations[i].populations = populations;
  };

  setAggrCombinationPopulations = (i, populations) => {
    this.combinations[i].aggrPopulations = populations;
  };

  syncPopulations = (definedPopulations) => {
    this.combinations.forEach(el => { el.populations = el.populations.filter(value => definedPopulations.includes(value)) });
  };

  syncAggrPopulations = (definedPopulations) => {
    this.combinationAll.forEach(el => el.aggrPopulations = definedPopulations);
  };

  get combinationAll() {
    return this.combinations.filter(el => el.name.toUpperCase() === 'ALL');
  };

  get combinationsJS() {
    return toJS(this.combinations);
  };

  get combinationsNames() {
    return this.combinations.map(el => el.name);
  };

  get aggrCombinationsJS() {
    return toJS(this.aggrCombinations);
  };

}

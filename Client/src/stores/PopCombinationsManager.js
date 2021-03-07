import { observable, computed, action, makeObservable, autorun } from 'mobx';
import GetNextId from '../utilities/GetNextId';
import GenerateId from '../utilities/GenerateId';
import IsNull from '../utilities/IsNull';

export default class PopCombinationsManager {
  parentMgr = null;

  combinations = new Map();

  selectedCombination = null;

  combinationAllId = null;

  constructor(mgr) {
    this.parentMgr = mgr;
    makeObservable(this, {
      combinations: observable,
      combinationAllId: observable,
      selectedCombination: observable,
      addEmptyCombination: action,
      removeCombinations: action,
      setSelectedCombination: action,
      setCombinationName: action,
      setCombinationName: action,
      setCombinationCasePopulations: action,
      setCombinationAggrPopulations: action,
      syncCasePopulations: action,
      syncAggrPopulations: action,
      combinationAll: computed,
      combinationsArray: computed,
      combinationsNames: computed,
    });

    const combId = GenerateId('combination');
    this.addEmptyCombination(combId, 'All data');
    this.setSelectedCombination(combId);
    this.combinationAllId = combId;

    autorun(() => {
      this.syncCasePopulations(this.parentMgr.popMgr.definedPopulations);
    });

    autorun(() => {
      this.syncAggrPopulations(this.parentMgr.aggrDataMgr.populationNames);
    });
  }

  addEmptyCombination = (id = null, name = null) => {
    if (IsNull(id)) {
      id = GenerateId('combination');
    }

    if (IsNull(name)) {
      name = `Combination ${GetNextId('Combination ', this.combinationsNames)}`
    }
    const combination = {
      id: id,
      name: name,
      casePopulations: [],
      aggrPopulations: []
    };
    this.combinations.set(id, combination);
    return id;
  };

  removeCombinations = ids => {
    ids.forEach(id => {
      if (this.combinations.has(id)) {
        this.combinations.delete(id);
      }
    });
    this.selectedCombination = this.combinationsArray[this.combinationsArray.length - 1];
  };

  setSelectedCombination = id => {
    if (this.combinations.has(id)) {
      this.selectedCombination = this.combinations.get(id);
    }
  };

  setCombinationName = (id, name) => {
    if (this.combinations.has(id)) {
      this.combinations.get(id).name = name;
    }
  };

  setCombinationCasePopulations = (id, populations) => {
    if (this.combinations.has(id)) {
      this.combinations.get(id).casePopulations = populations;
    }
  };

  setCombinationAggrPopulations = (id, populations) => {
    if (this.combinations.has(id)) {
      this.combinations.get(id).aggrPopulations = populations;
    }
  };

  syncCasePopulations = (definedPopulations) => {
    this.combinations.forEach(el => {
      el.casePopulations = el.casePopulations.filter(value => definedPopulations.includes(value));
    });
  };

  syncAggrPopulations = (definedPopulations) => {
    this.combinations.forEach(el => {
      el.aggrPopulations = el.aggrPopulations.filter(value => definedPopulations.includes(value));
    });
    this.combinationAll.aggrPopulations = definedPopulations;
  };

  get combinationAll() {
    if (this.combinations.has(this.combinationAllId)) {
      return this.combinations.get(this.combinationAllId);
    } else {
      return null;
    }
  };

  get combinationsArray() {
    return Array.from(this.combinations.values());
  };

  get combinationsNames() {
    return this.combinationsArray.map(el => el.name);
  };

}

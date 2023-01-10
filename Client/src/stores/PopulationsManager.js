import { observable, computed, action, toJS, makeObservable } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import GenerateId from '../utilities/GenerateId';
import KeepValuesInArray from '../utilities/KeepValuesInArray';

export default class PopulationsManager {
  rootMgr = null;

  availableVariables = [];

  availableStrata = {};

  populations = [];

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      availableVariables: observable,
      availableStrata: observable,
      populations: observable,
      addEmptyPopulation: action,
      removePopulations: action,
      setPopulationVariables: action,
      setAvailableVariables: action,
      setAvailableStrata: action,
      populationsJS: computed,
      availableVarNames: computed,
      definedPopulations: computed,
    });
  }

  addEmptyPopulation = () => {
    this.populations.push({
      id: GenerateId('Population'),
      variables: [],
      variablesKey: null,
      strata: []
    });
  };

  setAvailableVariables = variables => {
    if (variables == null) {
      variables = [];
    }
    this.availableVariables = variables;
    this.populations = [];
  };

  setAvailableStrata = strata => {
    if (strata == null) {
      strata = {};
    }
    this.availableStrata = strata;
    this.populations = [];
  };

  removePopulations = idxs => {
    this.populations = RemoveElementsFromArray(this.populations, idxs);
  };

  setPopulationVariables = (i, variables) => {
    this.populations[i].variables = KeepValuesInArray(this.availableVarNames, variables);
    this.populations[i].variablesKey = this.populations[i].variables.join(', ');
    this.populations[i].strata = this.availableStrata[this.populations[i].variablesKey];
  };

  get populationsJS() {
    return toJS(this.populations);
  };

  get availableVarNames() {
    return this.availableVariables.map(el => el.Name);
  }

  get definedPopulations() {
    return [...new Set(this.populations.map(el => el.strata.map(el2 => el2.Combination)).flat())];
  };

  setUIState = uiState => {
    this.availableVariables = uiState.availableVariables;
    this.availableStrata = uiState.availableStrata;
    this.populations = uiState.populations;
  }
}

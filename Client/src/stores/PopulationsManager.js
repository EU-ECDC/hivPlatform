import { observable, computed, action, toJS, makeObservable } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import GenerateId from '../utilities/GenerateId';
import KeepValuesInArray from '../utilities/KeepValuesInArray';

export default class PopulationsManager {
  rootMgr = null;

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
      // definedPopulations: computed,
      // populationsNames: computed,
    });
  }

  availableVariables = [];

  availableStrata = {};

  populations = [];

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
  };

  setAvailableStrata = strata => {
    if (strata == null) {
      strata = {};
    }
    this.availableStrata = strata;
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

  // get availableStrataNames() {
  //   return Object.keys(this.availableStrata);
  // };

  // get populationsNames() {
  //   return this.populations.map(el => el.name);
  // };

  // get definedPopulations() {
  //   return [...new Set(this.populations.map(el => el.populations).flat())];
  // };

  // recreatePopulations = (i) => {
  //   let strataGroup = this.populations[i];
  //   let populations = [];

  //   if (strataGroup.strata.length > 0) {
  //     const variable = strataGroup.strata[0];
  //     const code = this.stratToCode[variable];
  //     populations = this.availableStrata[variable].map(el => `${el} [${code}]`);
  //     for (let j = 1; j < strataGroup.strata.length; ++j) {
  //       const variable = strataGroup.strata[j];
  //       const code = this.stratToCode[variable];
  //       let extraPopulations = this.availableStrata[variable].map(el => `${el} [${code}]`);
  //       populations = populations.map(el1 => extraPopulations.map(el2 => [el1, el2].join(', '))).flat();
  //     }
  //   }
  //   this.populations[i].populations = populations;
  // };
}

import { observable, computed, action, toJS } from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';

export default class OriginGroupingsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
  }

  @observable
  distribution = {
    origin: [],
    count: []
  };

  @observable
  groupings = [];

  @observable
  type = 'REPCOUNTRY + UNK + OTHER';

  @computed
  get distributionArray() {
    const origins = this.distribution.origin;
    const counts = this.distribution.count;
    const map = origins.map((el, i) => ({
      origin: origins[i],
      count: counts[i]
    }));

    return map;
  };

  @computed
  get origins() {
    return this.distribution.origin.slice().sort();
  };

  @computed
  get usedOrigins() {
    return [].concat.apply([], this.groupings.map(el => el.origin));
  };

  @computed
  get unusedOrigins() {
    return this.origins.filter(x => !this.usedOrigins.includes(x));
  };

  @computed
  get groupingsJS() {
    return toJS(this.groupings);
  };

  @action setDistribution = distr => this.distribution = distr;

  @action setGroupings = groupings => {
    // Make sure that FullRegionsOfOrigin are arrays
    const temp = groupings.map(el => {
      const arr =
        Array.isArray(el.origin) ? el.origin : [el.origin];
      return ({
        name: el.name,
        origin: arr,
        groupCount: 0,
      })
    })
    this.groupings = temp;
    this.computeGroupCounts();
  };

  @action setType = type => this.type = type;

  @action setGroupName = (i, name) => {
    this.groupings[i].name = name;
    this.type = 'Custom';
  };

  @action setGroupOrigin = (i, origin) => {
    this.groupings[i].origin = origin;
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  @action removeGroupings = selectedIds => {
    this.groupings = RemoveElementsFromArray(this.groupings, selectedIds);
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  @action addEmptyGrouping = () => {
    this.groupings.push({
      name: 'New',
      groupeCount: 0,
      origin: []
    });
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  @action applyGroupings = () => {
    this.rootMgr.inputValueSet('originGrouping:OriginGroupingArray', this.groupings);
  };

  computeGroupCounts = () => {
    this.groupings.forEach(
      group => {
        const groupCount = group.origin.reduce((acc, origin) => {
          const idx = this.distributionArray.findIndex(el => el.origin == origin);
          const val = idx !== -1 ? acc + this.distributionArray[idx].count : acc;
          return val;
        }, 0);
        group.groupCount = groupCount;
      }
    );
  };
}

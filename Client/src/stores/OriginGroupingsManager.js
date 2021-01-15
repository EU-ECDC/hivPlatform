import { observable, computed, action, toJS, makeObservable} from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import IsNull from '../utilities/IsNull';

export default class OriginGroupingsManager {
  rootMgr = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      distribution: observable,
      groupings: observable,
      type: observable,
      actionStatus: observable,
      actionMessage: observable,
      distributionArray: computed,
      origins: computed,
      usedOrigins: computed,
      unusedOrigins: computed,
      groupingsJS: computed,
      setDistribution: action,
      setGroupings: action,
      setType: action,
      setGroupName: action,
      setGroupOrigin: action,
      removeGroupings: action,
      addEmptyGrouping: action,
      applyGroupings: action,
      setActionStatus: action,
      setActionMessage: action,
      actionValid: computed
    });
  }

  distribution = {
    origin: [],
    count: []
  };

  groupings = [];

  type = 'REPCOUNTRY + UNK + OTHER';

  actionStatus = null;
  actionMessage = null;

  get distributionArray() {
    const origins = this.distribution.origin;
    const counts = this.distribution.count;
    const map = origins.map((el, i) => ({
      origin: origins[i],
      count: counts[i]
    }));

    return map;
  };

  get origins() {
    return this.distribution.origin.slice().sort();
  };

  get usedOrigins() {
    return [].concat.apply([], this.groupings.map(el => el.origin));
  };

  get unusedOrigins() {
    return this.origins.filter(x => !this.usedOrigins.includes(x));
  };

  get groupingsJS() {
    return toJS(this.groupings);
  };

  setDistribution = distr => this.distribution = distr;

  setGroupings = groupings => {
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

  setType = type => this.type = type;

  setActionStatus = status => this.actionStatus = status;

  setActionMessage = message => this.actionMessage = message;

  setGroupName = (i, name) => {
    this.groupings[i].name = name;
    this.type = 'Custom';
  };

  setGroupOrigin = (i, origin) => {
    this.groupings[i].origin = origin;
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  removeGroupings = selectedIds => {
    this.groupings = RemoveElementsFromArray(this.groupings, selectedIds);
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  addEmptyGrouping = () => {
    this.groupings.push({
      name: 'New',
      groupeCount: 0,
      origin: []
    });
    this.computeGroupCounts();
    this.type = 'Custom';
  };

  applyGroupings = () => {
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

  get actionValid() {
    if (IsNull(this.actionStatus)) {
      return (null);
    } else {
      return this.actionStatus === 'SUCCESS';
    }
  };
}

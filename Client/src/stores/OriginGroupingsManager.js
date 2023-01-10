import { observable, computed, action, toJS, makeObservable, autorun} from 'mobx';
import RemoveElementsFromArray from '../utilities/RemoveElementsFromArray';
import IsNull from '../utilities/IsNull';
import EnsureArray from '../utilities/EnsureArray';
import GetNextId from '../utilities/GetNextId';

export default class OriginGroupingsManager {
  rootMgr = null;

  distribution = {
    FullRegionOfOrigin: [],
    Count: []
  };

  groupings = [];

  preset = 'REPCOUNTRY + UNK + OTHER';

  repCountryGroupingIdx = null;

  actionStatus = null;
  actionMessage = null;
  migrantCompatibleStatus = null;
  migrantCompatibleMessage = null;

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      distribution: observable,
      groupings: observable,
      preset: observable,
      actionStatus: observable,
      actionMessage: observable,
      migrantCompatibleStatus: observable,
      migrantCompatibleMessage: observable,
      distributionArray: computed,
      origins: computed,
      usedOrigins: computed,
      unusedOrigins: computed,
      groupingsJS: computed,
      usedNames: computed,
      setDistribution: action,
      setGroupings: action,
      setPreset: action,
      setGroupName: action,
      setGroupOrigin: action,
      setMigrantOrigin: action,
      removeGroupings: action,
      addEmptyGrouping: action,
      applyGroupings: action,
      setActionStatus: action,
      setActionMessage: action,
      actionValid: computed,
      setUIState: action
    });

    autorun(() => {
      this.rootMgr.inputValueSet('checkOriginGrouping:OriginGroupingArray', this.groupingsJS);
    })
  }

  get distributionArray() {
    const origins = this.distribution.FullRegionOfOrigin;
    const counts = this.distribution.Count;
    const map = origins.map((el, i) => ({
      origin: origins[i],
      count: counts[i]
    }));

    return map;
  };

  get origins() {
    return this.distribution.FullRegionOfOrigin.slice().sort();
  };

  get usedOrigins() {
    return [].concat.apply([], this.groupings.map(el => el.FullRegionOfOrigin));
  };

  get unusedOrigins() {
    return this.origins.filter(x => !this.usedOrigins.includes(x));
  };

  get groupingsJS() {
    return toJS(this.groupings);
  };

  get usedNames() {
    return this.groupings.map(el => el.GroupedRegionOfOrigin);
  };

  setDistribution = distr => this.distribution = distr;

  setGroupings = groupings => {
    // Make sure that FullRegionsOfOrigin are arrays
    this.groupings = groupings.map(el =>
      ({
        GroupedRegionOfOrigin: el.GroupedRegionOfOrigin,
        FullRegionOfOrigin: EnsureArray(el.FullRegionOfOrigin),
        MigrantRegionOfOrigin: el.MigrantRegionOfOrigin,
        groupCount: 0,
      })
    );
    this.computeGroupCounts();
  };

  setPreset = preset => this.preset = preset;

  setActionStatus = status => this.actionStatus = status;

  setActionMessage = message => this.actionMessage = message;

  setMigrantCompatibleStatus = status => this.migrantCompatibleStatus = status;

  setMigrantCompatibleMessage = message => this.migrantCompatibleMessage = message;

  setGroupName = (i, name) => {
    this.groupings[i].GroupedRegionOfOrigin = name;
    this.preset = 'Custom';
  };

  setGroupOrigin = (i, origin) => {
    this.groupings[i].FullRegionOfOrigin = origin;
    this.computeGroupCounts();
    this.preset = 'Custom';
  };

   setMigrantOrigin = (i, origin) => {
    this.groupings[i].MigrantRegionOfOrigin = origin;
    this.computeGroupCounts();
    this.preset = 'Custom';
  };

  removeGroupings = selectedIds => {
    this.groupings = RemoveElementsFromArray(this.groupings, selectedIds);
    this.computeGroupCounts();
    this.preset = 'Custom';
  };

  addEmptyGrouping = () => {
    this.groupings.push({
      GroupedRegionOfOrigin: `Group ${GetNextId('Group ', this.usedNames)}`,
      FullRegionOfOrigin: [],
      MigrantRegionOfOrigin: '',
      groupCount: 0
    });
    this.computeGroupCounts();
    this.preset = 'Custom';
  };

  applyGroupings = () => {
    this.rootMgr.btnClicked('originGrouping:OriginGroupingArray', this.groupings);
  };

  computeGroupCounts = () => {
    this.groupings.forEach(
      group => {
        group.groupCount = group.FullRegionOfOrigin.reduce((acc, origin) => {
          const idx = this.distributionArray.findIndex(el => el.origin == origin);
          const val = idx !== -1 ? acc + this.distributionArray[idx].count : acc;
          return val;
        }, 0);
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

  setUIState = uiState => {
    this.distribution = uiState.distribution;
    this.groupings = uiState.groupings;
    this.preset = uiState.preset;
    this.actionStatus = uiState.actionStatus;
    this.actionMessage = uiState.actionMessage;
    this.migrantCompatibleStatus = uiState.migrantCompatibleStatus;
    this.migrantCompatibleMessage = uiState.migrantCompatibleMessage;
  }
}

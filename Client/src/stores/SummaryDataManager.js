import { observable, action, computed, toJS } from 'mobx';

export default class SummaryDataManager {
  rootMgr = null;

  @observable
  diagYearPlotData = {
    filter: {
      scaleMinYear: null,
      scaleMaxYear: null,
      valueMinYear: null,
      valueMaxYear: null,
      applyInAdjustments: false
    },
    chartCategories: [],
    chartData: [],
  };

  @observable
  notifQuarterPlotData = {
    filter: {
      scaleMinYear: null,
      scaleMaxYear: null,
      valueMinYear: null,
      valueMaxYear: null,
      applyInAdjustments: false
    },
    chartCategories: [],
    chartData: []
  };

  @observable
  missPlotData = {
    plot1: {
      chartCategories: [],
      chartData: {
        all: [],
        female: [],
        male: []
      }
    },
    plot2: {
      chartCategories: [],
      chartData: {
        all: [],
        female: [],
        male: []
      }
    },
    plot3: {
      chartData: {
        all: [],
        female: [],
        male: []
      },
    },
    plot4: {
      chartCategories: [],
      chartData: {
        all: [],
        female: [],
        male: [],
      }
    }
  };

  @observable
  missPlotSelection = 'all';

  @observable
  repDelPlotData = {
    chartData: {
      all: {q95: 0, series: []},
      female: { q95: 0, series: []},
      male: { q95: 0, series: []}
    }
  };

  @observable
  repDelPlotSelection = 'all';

  constructor(mgr) {
    this.rootMgr = mgr;
  };

  @action
  setDiagYearPlotData = data => this.diagYearPlotData = data;

  @action
  setDiagYearFilterApply = apply => this.diagYearPlotData.filter.applyInAdjustments = apply;

  @action
  setDiagYearFilterMinYear = minYear => this.diagYearPlotData.filter.valueMinYear = minYear;

  @action
  setDiagYearFilterMaxYear = maxYear => this.diagYearPlotData.filter.valueMaxYear = maxYear;

  @action
  setNotifQuarterPlotData = data => this.notifQuarterPlotData = data;

  @action
  setNotifQuarterFilterApply = apply => this.notifQuarterPlotData.filter.applyInAdjustments = apply;

  @action
  setNotifQuarterFilterMinYear = minYear => this.notifQuarterPlotData.filter.valueMinYear = minYear;

  @action
  setNotifQuarterFilterMaxYear = maxYear => this.notifQuarterPlotData.filter.valueMaxYear = maxYear;

  @action
  setMissPlotData = data => this.missPlotData = data;

  @action
  setMissPlotSelection = selection => this.missPlotSelection = selection;

  @action
  setRepDelPlotData = data => this.repDelPlotData = data;

  @action
  setRepDelPlotSelection = selection => this.repDelPlotSelection = selection;

  @computed
  get missPlot1Series() {
    return [{
      name: 'Missingness',
      data: this.missPlotData.plot1.chartData[this.missPlotSelection]
    }];
  };

  @computed
  get missPlot2Series() {
    const data = this.missPlotData.plot2.chartData[this.missPlotSelection].map(
      (layer, i) => ({
        name: `Combination ${i + 1}`,
        data: layer.map((cat, j) => ({ x: this.missPlotData.plot2.chartCategories[j], y: cat }))
      })
    );
    return data;
  };

  @computed
  get missPlot3Series() {
    const data = ['Present', 'Missing'].map(
      name => ({
        name: name,
        data: this.missPlotData.plot3.chartData[this.missPlotSelection].map(
          (el, i) => ({ x: `Combination ${i + 1}`, y: el.name === name ? el.y : 0 })
        )
      })
    );
    return data;
  };

  @computed
  get missPlot4Series() {
    return this.missPlotData.plot4.chartData[this.missPlotSelection];
  };

  @computed
  get repDelPlot() {
    // Applied toJS in order to get rid of mobx error
    const data = toJS(this.repDelPlotData.chartData[this.repDelPlotSelection]);
    return {
      q95: data.q95,
      series: [{
        name: 'density',
        data: data.series
      }]
    };
  };

  @computed
  get missPlot3Categories() {
    const cats = this.missPlotData.plot3.
      chartData[this.missPlotSelection].
      map(el => `${(el.y * 100).toFixed(2)} %`);
    return cats;
  };

  @computed
  get missPlot4Categories() {
    return this.missPlotData.plot4.chartCategories;
  };
}

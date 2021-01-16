import { observable, action, computed, toJS, makeObservable, autorun } from 'mobx';

export default class SummaryDataManager {
  rootMgr = null;

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

  missPlotSelection = 'all';

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
    makeObservable(this, {
      diagYearPlotData: observable,
      notifQuarterPlotData: observable,
      missPlotData: observable,
      missPlotSelection: observable,
      repDelPlotData: observable,
      repDelPlotSelection: observable,
      setDiagYearPlotData: action,
      setDiagYearFilterApply: action,
      setDiagYearFilterMinYear: action,
      setDiagYearFilterMaxYear: action,
      setNotifQuarterPlotData: action,
      setNotifQuarterFilterApply: action,
      setNotifQuarterFilterMinYear: action,
      setNotifQuarterFilterMaxYear: action,
      setMissPlotData: action,
      setMissPlotSelection: action,
      setRepDelPlotData: action,
      setRepDelPlotSelection: action,
      missPlot1Series: computed,
      missPlot2Series: computed,
      missPlot3Series: computed,
      missPlot4Series: computed,
      repDelPlot: computed,
      missPlot3Categories: computed,
      missPlot4Categories: computed,
    });

    autorun(() => {
      this.rootMgr.inputValueSet('summaryFilters', {
        DiagYear: {
          MinYear: this.diagYearPlotData.filter.valueMinYear,
          MaxYear: this.diagYearPlotData.filter.valueMaxYear
        },
        NotifQuarter: {
          MinYear: this.notifQuarterPlotData.filter.valueMinYear,
          MaxYear: this.notifQuarterPlotData.filter.valueMaxYear
        }
      })
    }, { delay: 1000 });
  };

  setDiagYearPlotData = data => this.diagYearPlotData = data;
  setDiagYearFilterApply = apply => this.diagYearPlotData.filter.applyInAdjustments = apply;
  setDiagYearFilterMinYear = minYear => this.diagYearPlotData.filter.valueMinYear = minYear;
  setDiagYearFilterMaxYear = maxYear => this.diagYearPlotData.filter.valueMaxYear = maxYear;
  setNotifQuarterPlotData = data => this.notifQuarterPlotData = data;
  setNotifQuarterFilterApply = apply => this.notifQuarterPlotData.filter.applyInAdjustments = apply;
  setNotifQuarterFilterMinYear = minYear => this.notifQuarterPlotData.filter.valueMinYear = minYear;
  setNotifQuarterFilterMaxYear = maxYear => this.notifQuarterPlotData.filter.valueMaxYear = maxYear;
  setMissPlotData = data => this.missPlotData = data;
  setMissPlotSelection = selection => this.missPlotSelection = selection;
  setRepDelPlotData = data => this.repDelPlotData = data;
  setRepDelPlotSelection = selection => this.repDelPlotSelection = selection;

  get missPlot1Series() {
    return [{
      name: 'Missingness',
      data: this.missPlotData.plot1.chartData[this.missPlotSelection]
    }];
  };

  get missPlot2Series() {
    const data = this.missPlotData.plot2.chartData[this.missPlotSelection].map(
      (layer, i) => ({
        name: `Combination ${i + 1}`,
        data: layer.map((cat, j) => ({ x: this.missPlotData.plot2.chartCategories[j], y: cat }))
      })
    );
    return data;
  };

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

  get missPlot4Series() {
    return this.missPlotData.plot4.chartData[this.missPlotSelection];
  };

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

  get missPlot3Categories() {
    const cats = this.missPlotData.plot3.
      chartData[this.missPlotSelection].
      map(el => `${(el.y * 100).toFixed(2)} %`);
    return cats;
  };

  get missPlot4Categories() {
    return this.missPlotData.plot4.chartCategories;
  };
}

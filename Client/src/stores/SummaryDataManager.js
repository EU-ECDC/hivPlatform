import { observable, action, computed, toJS, makeObservable, autorun } from 'mobx';
import QuarterToString from '../utilities/QuarterToString';
import FormatPercentage from '../utilities/FormatPercentage';
export default class SummaryDataManager {
  rootMgr = null;

  selectedCount = null;
  totalCount = null;

  diagYearPlotData = {
    filter: {
      scaleMinYear: null,
      scaleMaxYear: null,
      valueMinYear: null,
      valueMaxYear: null,
      applyInAdjustments: null
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
      applyInAdjustments: null
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
      all: { q95: 0, series: [] },
      female: { q95: 0, series: [] },
      male: { q95: 0, series: [] }
    }
  };

  repDelPlotSelection = 'all';

  constructor(mgr) {
    this.rootMgr = mgr;
    makeObservable(this, {
      selectedCount: observable,
      totalCount: observable,
      diagYearPlotData: observable,
      notifQuarterPlotData: observable,
      missPlotData: observable,
      missPlotSelection: observable,
      repDelPlotData: observable,
      repDelPlotSelection: observable,
      reset: action,
      setSelectedCount: action,
      setTotalCount: action,
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
      notifQuarterSliderMarks: computed,
      notifQuarterChartCategories: computed,
      missPlot1Series: computed,
      missPlot2Series: computed,
      missPlot3Series: computed,
      missPlot4Series: computed,
      repDelPlot: computed,
      missPlot3Categories: computed,
      missPlot4Categories: computed,
      filters: computed,
    });

    autorun(
      () => this.rootMgr.inputValueSet('summaryFilters', this.filters),
      { delay: 1000 }
    );
  };

  setSelectedCount = count => this.selectedCount = count;
  setTotalCount = count => this.totalCount = count;
  setDiagYearPlotData = data => this.diagYearPlotData = data;
  setDiagYearFilterApply = apply => this.diagYearPlotData.filter.applyInAdjustments = apply;
  setDiagYearFilterMinYear = minYear => {
    if (this.diagYearPlotData.filter.valueMinYear !== minYear) {
      this.diagYearPlotData.filter.valueMinYear = minYear;
    }
  };
  setDiagYearFilterMaxYear = maxYear => {
    if (this.diagYearPlotData.filter.valueMaxYear !== maxYear) {
      this.diagYearPlotData.filter.valueMaxYear = maxYear;
    }
  };
  setNotifQuarterPlotData = data => this.notifQuarterPlotData = data;
  setNotifQuarterFilterApply = apply => this.notifQuarterPlotData.filter.applyInAdjustments = apply;
  setNotifQuarterFilterMinYear = minYear => {
    if (this.notifQuarterPlotData.filter.valueMinYear !== minYear) {
      this.notifQuarterPlotData.filter.valueMinYear = minYear;
    }
  };
  setNotifQuarterFilterMaxYear = maxYear => {
    if (this.notifQuarterPlotData.filter.valueMaxYear !== maxYear) {
      this.notifQuarterPlotData.filter.valueMaxYear = maxYear;
    }
  };
  setMissPlotData = data => this.missPlotData = data;
  setMissPlotSelection = selection => this.missPlotSelection = selection;
  setRepDelPlotData = data => this.repDelPlotData = data;
  setRepDelPlotSelection = selection => this.repDelPlotSelection = selection;

  get notifQuarterSliderMarks() {
    return this.notifQuarterPlotData.chartCategories.map(value => ({
      value: value,
      label: ''
    }));
  };

  get notifQuarterChartCategories() {
    return this.notifQuarterPlotData.chartCategories.map(value => QuarterToString(value));
  };

  get missPlot1Series() {
    return this.missPlotData.plot1.chartData[this.missPlotSelection];
  };

  get missPlot2Series() {
    return this.missPlotData.plot2.chartData[this.missPlotSelection];
  };

  get missPlot3Series() {
    const selectedData = this.missPlotData.plot3.chartData[this.missPlotSelection];
    let data = ['Present', 'Missing'].map(
      name => selectedData.map(el => el.name === name ? el.y : 0)
    );
    data[2] = selectedData.map(el => FormatPercentage(el.y));
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
    const cats =
      this.missPlotData.plot3.
        chartData[this.missPlotSelection].
        map(el => `${(el.y * 100).toFixed(2)} %`);
    return cats;
  };

  get missPlot4Categories() {
    return this.missPlotData.plot4.chartCategories;
  };

  get filters() {
    return {
      DiagYear: {
        ApplyInAdjustments: this.diagYearPlotData.filter.applyInAdjustments,
        MinYear: this.diagYearPlotData.filter.valueMinYear,
        MaxYear: this.diagYearPlotData.filter.valueMaxYear,
      },
      NotifQuarter: {
        ApplyInAdjustments: this.notifQuarterPlotData.filter.applyInAdjustments,
        MinYear: this.notifQuarterPlotData.filter.valueMinYear,
        MaxYear: this.notifQuarterPlotData.filter.valueMaxYear
      }
    }
  };

  reset = () => {
    this.selectedCount = null;
    this.totalCount = null;

    this.diagYearPlotData = {
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

    this.notifQuarterPlotData = {
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

    this.missPlotData = {
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

    this.missPlotSelection = 'all';

    this.repDelPlotData = {
      chartData: {
        all: { q95: 0, series: [] },
        female: { q95: 0, series: [] },
        male: { q95: 0, series: [] }
      }
    };

    this.repDelPlotSelection = 'all';
  };
}

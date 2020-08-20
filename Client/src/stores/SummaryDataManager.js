import { observable, action, computed, toJS } from 'mobx';
import padStart from 'lodash/padStart';
import { PausePresentationRounded } from '@material-ui/icons';

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
    selected: 'all',
    plot1: {
      chartCategories: ['CD4', 'Migrant', 'Transmission', 'Age'],
      chartData: {
        all: [0.25, 0.23, 0.19, 0.12],
        female: [0.35, 0.23, 0.19, 0.2],
        male: [0.45, 0.23, 0.19, 0.1]
      }
    },
    plot2: {
      chartCategories: ['CD4', 'Migrant', 'Transmission', 'Age'],
      chartData: {
        all: [[1, 1, 1, 1], [0, 1, 0, 1], [1, 0, 1, 1], [1, 0, 0, 0]],
        female: [[1, 1, 1, 1], [0, 1, 0, 1], [1, 0, 1, 1]],
        male: [[1, 1, 1, 1], [0, 1, 0, 1]]
      }
    },
    plot3: {
      chartData: {
        all: [{ name: 'Missing', y: 0.03 }, { name: 'Missing', y: 0.07 }, { name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }],
        female: [{ name: 'Missing', y: 0.07 }, { name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }],
        male: [{ name: 'Missing', y: 0.14 }, { name: 'Present', y: 0.2622 }]
      },
    },
    plot4: {
      chartCategories: [1999, 2000, 2001, 2002, 2003],
      chartData: {
        all: [
          { name: 'CD4', data: [0.2, 0.3, 0.5, 0.2, 0.4] },
          { name: 'Migrant', data: [0.4, 0.1, 0.09, 0.1, 0.7] },
          { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.12, 0.44] },
          { name: 'Age', data: [0.5, 0.2, 0.55, 0.6, 0.34] }
        ],
        female: [
          { name: 'CD4', data: [0.2, 0.3, 0.3, 0.2, 0.4] },
          { name: 'Migrant', data: [0.5, 0.1, 0.09, 0.1, 0.7] },
          { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.32, 0.44] },
          { name: 'Age', data: [0.5, 0.2, 0.55, 0.6, 0.34] }
        ],
        male: [
          { name: 'CD4', data: [0.2, 0.3, 0.5, 0.2, 0.4] },
          { name: 'Migrant', data: [0.6, 0.1, 0.09, 0.1, 0.6] },
          { name: 'Transmission', data: [0.7, 0.5, 0.3, 0.12, 0.44] },
          { name: 'Age', data: [0.5, 0.2, 0.45, 0.5, 0.34] }
        ],
      }
    }
  };

  @observable
  repDelPlotData = {
    selected: 'all',
    chartData: {
      all: [
        { name: 'density', data: [[0, 0.5], [0.25, 0.28], [0.5, 0.4], [0.75, 0.25], [1, 0.16], [1.25, 0.05], [1.5, 0.013], [1.75, 0.007], [2, 0.002], [2.25, 0.001]] }
      ],
      female: [
        { name: 'density', data: [[0, 0.25], [0.25, 0.28], [0.5, 0.4], [0.75, 0.25], [1, 0.16], [1.25, 0.05], [1.5, 0.013], [1.75, 0.007], [2, 0.002], [2.25, 0.001]] }
      ],
      male: [
        { name: 'density', data: [[0, 0.75], [0.25, 0.28], [0.5, 0.4], [0.75, 0.25], [1, 0.16], [1.25, 0.05], [1.5, 0.013], [1.75, 0.007], [2, 0.002], [2.25, 0.001]] }
      ]
    }
  };

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
  setMissPlotSelection = selection => this.missPlotData.selected = selection;

  @action
  setRepDelPlotSelection = selection => this.repDelPlotData.selected = selection;

  @computed
  get missPlot1Series() {
    return [{
      name: 'Missingness',
      data: this.missPlotData.plot1.chartData[this.missPlotData.selected]
    }];
  };

  @computed
  get missPlot2Series() {
    const data = this.missPlotData.plot2.chartData[this.missPlotData.selected].map(
      (layer, i) => ({
        name: `Layer ${i + 1}`,
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
        data: this.missPlotData.plot3.chartData[this.missPlotData.selected].map(
          (el, i) => ({ x: `Layer ${i + 1}`, y: el.name === name ? el.y : 0 })
        )
      })
    );
    return data;
  };

  @computed
  get missPlot4Series() {
    return this.missPlotData.plot4.chartData[this.missPlotData.selected];
  };

  @computed
  get repDelPlotSeries() {
    return toJS(this.repDelPlotData.chartData[this.repDelPlotData.selected]);
  };

  @computed
  get missPlot3Categories() {
    const cats = this.missPlotData.plot3.chartData[this.missPlotData.selected].map(el => padStart(`${(el.y * 100).toFixed(2)} %`, 8));
    return cats;
  };

  @computed
  get missPlot4Categories() {
    return this.missPlotData.plot4.chartCategories;
  };
}

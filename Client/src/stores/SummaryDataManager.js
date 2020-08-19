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
        all: [
          {
            name: 'Layer 1',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 1 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 2',
            data: [{ x: 'CD4', y: 0 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 0 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 3',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 0 }, { x: 'Transmission', y: 1 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 4',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 0 }, { x: 'Transmission', y: 0 }, { x: 'Age', y: 0 }]
          }
        ],
        female: [
          {
            name: 'Layer 1',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 1 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 2',
            data: [{ x: 'CD4', y: 0 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 0 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 3',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 0 }, { x: 'Transmission', y: 1 }, { x: 'Age', y: 1 }]
          },
        ],
        male: [
          {
            name: 'Layer 1',
            data: [{ x: 'CD4', y: 1 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 1 }, { x: 'Age', y: 1 }]
          },
          {
            name: 'Layer 2',
            data: [{ x: 'CD4', y: 0 }, { x: 'Migrant', y: 1 }, { x: 'Transmission', y: 0 }, { x: 'Age', y: 1 }]
          },
        ]
      }
    },
    plot3: {
      chartCategories: ['26.22%', '14.00%', '7.00%', '3.00%'],
      chartData: {
        all: [
          { name: 'Present', data: [{ x: 'Layer1', y: 0 }, { x: 'Layer2', y: 0 }, { x: 'Layer3', y: 0 }, { x: 'Layer4', y: 0.2622 }] },
          { name: 'Missing', data: [{ x: 'Layer1', y: 0.03 }, { x: 'Layer2', y: 0.07 }, { x: 'Layer3', y: 0.14 }, { x: 'Layer4', y: 0 }] }
        ],
        female: [
          { name: 'Present', data: [{ x: 'Layer1', y: 0 }, { x: 'Layer2', y: 0 }, { x: 'Layer3', y: 0.3 }] },
          { name: 'Missing', data: [{ x: 'Layer1', y: 0.03 }, { x: 'Layer2', y: 0.07 }, { x: 'Layer3', y: 0 }] }
        ],
        male: [
          { name: 'Present', data: [{ x: 'Layer1', y: 0 }, { x: 'Layer2', y: 0.4 }] },
          { name: 'Missing', data: [{ x: 'Layer1', y: 0.03 }, { x: 'Layer2', y: 0 }] }
        ]
      }
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
    return this.missPlotData.plot2.chartData[this.missPlotData.selected];
  };

  @computed
  get missPlot3Series() {
    return this.missPlotData.plot3.chartData[this.missPlotData.selected];
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
    return this.missPlotData.plot3.chartCategories;
  };

  @computed
  get missPlot4Categories() {
    return this.missPlotData.plot4.chartCategories;
  };
}

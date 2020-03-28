import React from 'react';
import Grid from '@material-ui/core/Grid';
//import { VictoryChart, VictoryBar, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';
import { XYPlot, LineSeries, VerticalGridLines, XAxis, YAxis, HorizontalGridLines } from 'react-vis';

const data = [
  { x: 0, y: 8 },
  { x: 1, y: 5 },
  { x: 2, y: 4 },
  { x: 3, y: 9 },
  { x: 4, y: 1 },
  { x: 5, y: 7 },
  { x: 6, y: 6 },
  { x: 7, y: 3 },
  { x: 8, y: 2 },
  { x: 9, y: 0 }
];

const TabSummary = () => {

  /*
  const [width, setWidth] = React.useState(window.innerWidth);
  const updateWidth = (ev) => {
    setWidth(ev.target.innerWidth - 300)
  };

  React.useEffect(
    () => {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  );
  */

  return (
    <Grid container>
      <Grid item xs={12}>
        <XYPlot height={300} width={300}>
          <LineSeries data={data} />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
        </XYPlot>
          {/*
          <VictoryChart
            // domainPadding will add space to each side of VictoryBar to
            // prevent it from overlapping the axis
            domainPadding={width/10}
            animate={false}
            standalone={true}
            width={width}
            height={300}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4]}
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`$${x / 1000}k`)}
            />
            <VictoryBar
              data={data}
              x="quarter"
              y="earnings"

            />
            <VictoryLine
              data={data}
              x="quarter"
              y="earnings"
            />
        </VictoryChart>
        */}
      </Grid>
    </Grid>
  );
};

export default TabSummary;

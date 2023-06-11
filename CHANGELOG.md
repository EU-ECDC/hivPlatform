## 3.0.1

###### _June 11 2023_

- Move migrant functionality to package HivEstInfTime
- Streamline logging of adjustments
- Update Windows deployment package to R 4.3.0


## 3.0.0

###### _April 16 2023_

- Update manual
- Merge security issues fixes
- Move Github repo to https://github.com/nextpagesoft/hivPlatform
- Update Windows deployment package to R 4.2.3
- Release version 3.0.0


## 3.0.0

###### _April 3 2023_

- Dynamically compute the number of cuts for RD with trend


## 3.0.0

###### _March 26 2023_

- Set constraints and step in delta4Fac input
- Fix wrong case-based data (non-bootstrap specific) passed to modelling


## 3.0.0

###### _March 10 2023_

- Fix loading UI state propagating unwanted actions to server


###### _March 7 2023_

- Update dependencies


## 3.0.0

###### _February 9 2023_

- Fix loading state


## 3.0.0

###### _February 8 2023_

- Fix fitting Cox model in RD with trend adjustment
- Support exporting HIV modelling XML files


## 3.0.0

###### _January 31 2023_

- Add draft HIV model saving


## 3.0.0

###### _January 29 2023_

- Implement saving and loading state


## 3.0.0

###### _January 3 2023_

- Fix combining case based data populations (use "and" instead of "or")
- Update dependencies


## 3.0.0

###### _December 21 2022_

- Fix running the package when installed
- Read details of the tool from R package DESCRIPTION
- Update dependencies


## 3.0.0

###### _December 16 2022_

- Correct data passed to RD adjustment after MI adjustment


## 3.0.0

###### _December 4 2022_

- Update dependencies


## 3.0.0

###### _November 10 2022_

- Update dependencies
- Move migrant connection to "Run Main Fit" tab


## 2.0.9

###### _October 18 2022_

- Complete migrant connection for HIV modelling main fit (pre- and post-processing)
- Update dependencies


## 2.0.8

###### _October 2 2022_

- Implement custom charts series for plotting confidence bounds
- Fix order of categories in diagnositic plots of migrant module


## 2.0.7

###### _June 22 2022_

- Fix matching of RD weights to the output object
- Adjust deployment script for R 4.2.0


## 2.0.6

###### _June 6 2022_

- Remove pre-existing Weight column in RD with trend
- Remove NAs when creating summary per notification quarter
- Rotate X axis label in RD total plots
- Update dependencies


## 2.0.5

###### _Februrary 27 2022_

- Allow loading a single aggregated data file (for instance "Dead")
- Update dependencies


## 2.0.4

###### _November 03 2021_

- Adjust user interface to use MUI5 (https://mui.com/) library


## 2.0.3

###### _October 20 2021_

- Update dependencies, including hivModelling where a fix to performing main fit is implemented


## 2.0.2

###### _September 30 2021_

- Update dependencies


## 2.0.1

###### _May 30 2021_

- Support incomplete input data of HIV model


## 2.0.0

###### _May 24 2021_

- Release version 2.0.0


## 1.9.63

###### _May 18 2021_

- Fix loading incomplete aggregated data


## 1.9.62

###### _May 17 2021_

- Fix combining aggregated data with case-based data (overwrite instead of add)
- Fix processing changes in aggregated data selection


## 1.9.61

###### _May 12 2021_

- Fix preparation of HIV model input data (categorization of CD4)
- Fix preparation of HIV model input data (allocation of cases with missing AIDS diagnosis date)
- Fix running RD with trend when there is no reporting delay in the input data
- Fix visiting output tables page second time (double bind)


## 1.9.60

###### _May 03 2021_

- Fix issues with all deployment processes


## 1.9.59

###### _Apr 30 2021_

- Deployment process reimplemented


## 1.9.58

###### _Apr 29 2021_

- Add download of HIV model outputs as Excel (tables and charts)


## 1.9.57

###### _Apr 29 2021_

- Add downloads for reporting delays (weights)
- Add background icons for case-based and aggregated data uploads
- Fix priting start and end time in adjustments


###### _Apr 18 2021_

- Support setting random seed
- Implement collecting entire UI state in JSON
- Implement manual documentation (placeholder used)
- Implement opening another instance of the tool


## 1.9.54

###### _Apr 14 2021_

- Enhance fix saving thetaF params in the main fit (hivModelling package)
- Do not show "page leave" popup when downloading files


## 1.9.53

###### _Apr 06 2021_

- Fix saving thetaF params in the main fit (hivModelling package)


## 1.9.52

###### _Apr 04 2021_

- Fix applying changes to HIV model paremeters (types)


## 1.9.51

###### _Mar 28 2021_

- Add exit confirmation dialog
- Fix applying changes to diagnosis rates matrix


## 1.9.50

###### _Mar 15 2021_

- Download links for HIV model outputs, boostrap iterations and statistics added


## 1.9.49

###### _Mar 14 2021_

- Support allowed year ranges and optimal year ranges in HIV model inputs
- Print tables next to charts in the HIV model outputs
- Fix loading and handling time intervals and diagnosis rates matrix
- Fix tasks errors being propagated to the main thread


## 1.9.48

###### _Mar 7 2021_

- HIV Modelling and parametric bootstrap implemented


## 1.9.47

###### _Mar 1 2021_

- Adjust summary plots visual style
- Implement HIV output plots

## 1.9.46

###### _Feb 23 2021_

- Change JS charting library from apexcharts to echarts
- Optimize client webpack setup


## 1.9.45

###### _Feb 18 2021_

- Introduce draft implementation of HIV Model outputs charts using echarts library.
- Fix setting selected sub tab.


## 1.9.44

###### _Feb 14 2021_

- HIV Modelling page reimplemented


## 1.9.43

###### _Feb 11 2021_

- Reimplement population combination


## 1.9.42

###### _Feb 9 2021_

- Fix filtering of data in Reporting Delays adjustment
- Reimplement UI for aggregated data selection


## 1.9.41

###### _Feb 8 2021_

- Fix creating adjustments report when data is filtered
- Fix stopping reports that are failing
- Clear current report when a new is being generated


## 1.9.40

###### _Feb 7 2021_

- Reimplement creation of case-based data populations

## 1.9.36

###### _Jan 27 2021_

- Support 'YYYY-MM' and 'MM-YYYY' date formats in input data

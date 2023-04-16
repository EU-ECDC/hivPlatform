import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const WelcomeCard = props => {
  const { title, description, moreText, image, onClick } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const getBtnCaption = () => expanded ? 'Read less...' : 'Read more...';

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardMedia style={{height: 300}}
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {title}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <Button onClick={handleExpandClick} size="small" color="primary">
          {getBtnCaption()}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {moreText}
        </CardContent>
      </Collapse>
    </Card>
  )
};

const TabWelcome = props => {
  const appMgr = props.appMgr;

  const handleCardClick = () => appMgr.uiStateMgr.setActivePageId(1);

  const accuracyMore = <React.Fragment>
    <p>
      The <b>HIV Estimates Accuracy Tool</b> is an application that uses statistical methods to
      calculate adjusted estimates from HIV surveillance data.
    </p>
    <p>
      Missing data are a well-recognised problem within surveillance systems. When values for some
      variables are missing and cases with missing values are excluded from analysis, it may lead
      to biased and potentially less precise estimates. Reporting delay, the time from case
      diagnosis to notification, can lead to problems when analysing the most recent years given
      that information on certain cases or variables may not have been collected yet due to
      national reporting process characteristics.
    </p>
    <p>
      With this tool you can correct missing data for the variables age, gender, transmission
      category and CD4 count. Additionally, the tool allows for correction of delays in reporting.
      The adjustments may be used separately or in combination.
    </p>
    <p>
      The tool accepts HIV case-based surveillance data and requires a minimum set of variables
      routinely collected at national public health systems.
    </p>
    <p>
      A complete instruction <a href='#'>manual</a> will guide you through the tool. The manual can
      also be consulted to interpret the outputs. The outputs include results in the form of a
      report containing tables and graphs, and datasets in various file formats, in which the
      corrections have been incorporated and are ready for further analysis.
    </p>
  </React.Fragment>

  const modellingMore = <React.Fragment>
    <p>
      The <b>HIV Modelling Tool</b> is an application that can estimate How many people are getting
      infected with HIV, how many are being missed or not being reported and how many should be on
      treatment.
    </p>
    <p>
      The tool uses CD4 back calculation methods to estimate the number of people living with HIV,
      including those not yet diagnosed. The tool can also estimate the annual number of new HIV
      infections, the average time between infection and diagnosis, and the number of undiagnosed
      people CD4 category.
    </p>
    <p>
      The tool accepts a minimum required set of variables: HIV cases, AIDS cases and HIVAIDS cases
      and, if available, CD4 count at HIV diagnosis. The tool uses aggregated HIV surveillance data
      or case-based data. Data adjusted by the Accuracy tool can thereafter be used as input data
      for this tool. When data on these parameters are provided, the tool also accounts for
      mortality and migration.
    </p>
    <p>
      A complete instruction manual will guide you through the tool. The <a href='#'>manual</a> can
      also be consulted to interpret the outputs and to aid in the selection of some parameters
      using clear and well instructed examples.
    </p>
  </React.Fragment>

  const allinoneMore = <React.Fragment>
    <p>
      The two tools were combined into one flexible tool that manages all inputs, adjustments and
      outputs in one simple workflow. After uploading HIV cased-based data, the data can be
      initially adjusted for missing information and/or reporting delay and then automatically used
      as input data to the modelling tool, where estimates of HIV incidence, prevalence and the
      undiagnosed number of people living with HIV can be made.
    </p>
  </React.Fragment>

  return (
    <Grid container direction='row' justifyContent='space-evenly' alignItems='baseline'>
      <Grid item xs={12}>
        <Box width='50%' m='auto' p={5}>
          <p>
            HIV continues to be of significant public health importance in the European Union as
            well as globally. To evaluate and direct prevention efforts, it is crucial to
            understand the pattern of new HIV infections, or HIV incidence, among groups most at
            risk of infection. It is also important to estimate the size of the total population of
            persons living with HIV, including those that are not yet diagnosed, in order to
            understand the burden of HIV and the need for antiretroviral treatment and other
            HIV-related care. Accurate surveillance data are crucial to achieve reliable parameter
            estimates.
          </p>
          <p>
            The ECDC HIV Modelling Platform provides a set of tools to support users to obtain
            reliable parameter estimates to appropriately direct and evaluate public health
            responses.
          </p>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          title='Accuracy'
          description='Adjust case-based data for missing values and reporting delay'
          moreText={accuracyMore}
          image='www/img/accuracy.png'
          onClick={handleCardClick}
        />
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          title='Modelling'
          description='Estimate number of PLHIV and incidence'
          moreText={modellingMore}
          image='www/img/modelling.png'
          onClick={handleCardClick}
        />
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          title='All-in-one'
          description='Accuracy adjustements and modelling integrated in one tool'
          moreText={allinoneMore}
          image='www/img/all-in-one.png'
          onClick={handleCardClick}
        />
      </Grid>
      <Grid item xs={12}>
        <Box width='50%' m='auto' p={5}>
          <p>
            NOTE: This is the latest version of HIV Platform tool (v3). Previous version (v2) is
            still available here on ECDC server: <a href='https://shinyapps.ecdc.europa.eu/shiny/hivPlatform_v2/' target='_blank'>https://shinyapps.ecdc.europa.eu/shiny/hivPlatform_v2/
            </a>
          </p>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TabWelcome;

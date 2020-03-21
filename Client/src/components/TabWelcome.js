import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const WelcomeCard = props => {
  const { mode, title, description, moreText, image, onClick } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const getBtnCaption = () => expanded ? 'Read less...' : 'Read more...';

  return (
    <Card>
      <CardActionArea onClick={onClick(mode)}>
        <CardMedia style={{height: 150}}
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
          <Typography paragraph>
            {moreText}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
};

const TabWelcome = props => {
  const appManager = props.appManager;

  const handleCardClick = mode => () => appManager.setMode(mode);

  return (
    <Grid container direction='row' justify='space-evenly' alignItems='baseline'>
      <Grid item xs={12}>
        <Box width='50%' m='auto' p={5}>
          <p>The ECDC HIV Estimates Accuracy Tool is an application that uses advanced statistical methods to correct for
          missing values in key HIV surveillance variables as well as for reporting delay, as defined by the time from
          case diagnosis to notification at the national level.</p>

          <p>The tool accepts case based HIV surveillance data prepared in a specific format. The outputs include results
          from pre-defined analyses in the form of a report containing tables and graphs, and datasets, in which the
          adjustments have been incorporated and which may be exported for further analysis.</p>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          mode='ACCURACY'
          title='Accuracy'
          description='Adjust case-based data for missing values and reporting delay'
          moreText='More information about the estimates accuracy.'
          image='https://www.cpomagazine.com/wp-content/uploads/2020/01/big-data-brings-challenges-beyond-the-capabilities-of-traditional-siems_1500.jpg'
          onClick={handleCardClick}
        />
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          mode='MODELLING'
          title='Modelling'
          description='Estimate number of PLHIV and incidence'
          moreText='More information about the modelling.'
          image='https://static.makeuseof.com/wp-content/uploads/2018/08/solve-math-equations-994x400.jpg'
          onClick={handleCardClick}
        />
      </Grid>
      <Grid item xs={3}>
        <WelcomeCard
          mode='ALL-IN-ONE'
          title='All-in-one'
          description='Accuracy adjustements and modelling integrated in one tool'
          moreText='More information about the modelling and estimates accuracy.'
          image='https://www.capgemini.com/pl-pl/wp-content/uploads/sites/15/2018/03/big-data-analytics-startups-1.jpg'
          onClick={handleCardClick}
        />
      </Grid>
    </Grid>
  );
};

export default TabWelcome;

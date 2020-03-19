import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';

const LeftNav = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const setStep = step => () => {
    setActiveStep(step);
    props.onStepChange(step);
  };

  return (
    <Stepper nonLinear activeStep={activeStep} orientation='vertical'>
      {props.steps.map((label, index) => (
        <Step key={index}>
          <StepButton onClick={setStep(index)}>
            <StepLabel>
              {label}
            </StepLabel>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

export default LeftNav;

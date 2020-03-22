import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';

const LeftNav = (props) => {
  const { steps, activeStep, onStepChange } = props;

  return (
    <div style={{ minWidth: 300, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={index} completed={step.completed} disabled={step.disabled}>
            <StepButton onClick={() => onStepChange(index)} >
              <StepLabel>
                {step.title}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default LeftNav;

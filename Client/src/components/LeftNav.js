import React from 'react';
import { observer } from 'mobx-react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { StepContent } from '@material-ui/core';

const LeftNav = (props) => {
  const { steps, activeStepId, onStepChange, onSubStepChange } = props;

  return (
    <div style={{ minWidth: 250, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activeStepId} orientation='vertical'>
        {steps.map((step, i) => (
          <Step key={i} completed={step.completed} disabled={step.disabled}>
            <StepButton onClick={() => onStepChange(i)} >
              <StepLabel>{step.title}</StepLabel>
            </StepButton>
            {step.subSteps && <StepContent>
              <List>
                {
                  step.subSteps.map((subStep, j) => (
                    <ListItem
                      button
                      key={j}
                      selected={j === step.activeSubStepId}
                      disabled={subStep.disabled}
                      onClick={() => onSubStepChange(i, j)}
                    >
                      {subStep.title}
                    </ListItem>
                  ))
                }
              </List>
            </StepContent>}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default observer(LeftNav);

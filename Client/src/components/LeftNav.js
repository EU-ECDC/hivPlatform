import React from 'react';
import { observer } from 'mobx-react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { StepContent } from '@material-ui/core';

const LeftNav = (props) => {
  const { steps, activeStepId, onStepChange, onSubStepChange } = props;

  return (
    <div style={{ minWidth: 300, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activeStepId} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={index} completed={step.completed} disabled={step.disabled}>
            <StepButton onClick={() => onStepChange(index)} >
              <StepLabel>{step.title}</StepLabel>
            </StepButton>
            {step.subSteps && <StepContent>
              <TreeView
                selected={String(step.activeSubStepId)}
                onNodeSelect={(event, subStepId) => onSubStepChange(index, parseInt(subStepId))}
              >
                {
                  step.subSteps.map((subStep, index) => (
                    <TreeItem nodeId={String(index)} label={subStep.title} key={index}></TreeItem>
                  ))
                }
              </TreeView>
              {/* <Stepper nonLinear activeStep={0} orientation='vertical'>
                {
                  step.subSteps.map((subStep, index) => (
                    <Step key={index}>
                      <StepButton>
                        <StepLabel>{subStep.title}</StepLabel>
                      </StepButton>
                    </Step>
                  ))
                }
              </Stepper> */}
            </StepContent>}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default observer(LeftNav);

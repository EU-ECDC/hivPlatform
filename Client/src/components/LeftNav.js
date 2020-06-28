import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { StepContent } from '@material-ui/core';

const LeftNav = (props) => {
  const { steps, activeStep, onStepChange } = props;

  return (
    <div style={{ minWidth: 300, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => (
          <Step key={index} completed={step.completed} disabled={step.disabled}>
            <StepButton onClick={() => onStepChange(index)} >
              <StepLabel>{step.title}</StepLabel>
            </StepButton>
            <StepContent>
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={['2']}
              >
                {
                  step.subSteps.map((subStep, index) => (
                    <TreeItem nodeId={String(index)} label={subStep.title} key={index}></TreeItem>
                  ))
                }
              </TreeView>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default LeftNav;

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
  const { pages, activePageId, onPageChange } = props;

  return (
    <div style={{ minWidth: 250, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activePageId} orientation='vertical'>
        {pages.map((page, i) => (
          <Step key={i} completed={page.completed} disabled={page.disabled}>
            <StepButton onClick={() => onPageChange(i)} >
              <StepLabel>{page.title}</StepLabel>
            </StepButton>
            {page.subPages && <StepContent>
              <List>
                {
                  page.subPages.map((subPage, j) => (
                    <ListItem
                      button
                      key={j}
                      selected={j === page.activeSubPageId}
                      disabled={subPage.disabled}
                      onClick={() => onPageChange(i, j)}
                    >
                      {subPage.title}
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

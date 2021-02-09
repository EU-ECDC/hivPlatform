import React from 'react';
import { observer } from 'mobx-react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { StepContent } from '@material-ui/core';
import IsNull from '../utilities/IsNull';

const LeftNav = (props) => {
  const { pages, activePageId, onPageChange } = props;

  return (
    <div style={{ minWidth: 250, backgroundColor: 'white' }}>
      <Stepper nonLinear activeStep={activePageId} orientation='vertical'>
        {pages.map((page, i) => {

          const buttonProps = {};
          if (!IsNull(page.description)) {
            buttonProps.optional = <Box width='150px' textAlign='left'>
              <Typography variant='caption'>{page.description}</Typography></Box>;
          }

          return (
            <Step key={i} completed={page.completed} disabled={page.disabled}>
              <StepButton onClick={() => onPageChange(i)} {...buttonProps}>
                {page.title}
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
          )
        })}
      </Stepper>
    </div>
  );
};

export default observer(LeftNav);

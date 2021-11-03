import React from 'react';
import { observer } from 'mobx-react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import StepContent from '@mui/material/StepContent';
import IsNull from '../utilities/IsNull';

const LeftNav = (props) => {
  const { pages, activePageId, onPageChange } = props;

  return (
    <div style={{
      minWidth: '220px',
      maxWidth: '220px',
      backgroundColor: 'white',
      padding: '12px 8px 12px 12px'
    }}>
      <Stepper nonLinear activeStep={activePageId} orientation='vertical' >
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
              {page.subPages.length > 0 && <StepContent>
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

import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <Accordion className='my-4'>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        // sx={{
        //     backgroundColor: '#f5f5f5', // Light gray background
        //     borderBottom: '1px solid #ddd', // Light gray border at the bottom
        //     '&:hover': {
        //       backgroundColor: '#e0e0e0', // Darker gray on hover
              
        //     },
        //   }}
      >
        <Typography >Q. {question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQItem;

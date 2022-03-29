import React from 'react';
import { Container, Typography, Box, Button } from '@material-ui/core';
import PublishAssetModal from '../../components/elements/modal/publishAsset';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

function getSteps() {
    return ['Choose Assets', 'Set Price', 'Set Dates and Addresses'];
}
function getStepContent(step) {
    switch (step) {
        case 0:
            return <Step1 />;
        case 1:
            return <Step2 />;
        case 2:
            return <Step3 />;
        default:
            return 'Unknown step';
    }
}

const PostAuction = () => {
    const steps = getSteps();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box className="post-auction">
            <Container maxWidth="xl">
                <Typography variant="h4">Post an Auction</Typography>
                {/*Post auction steps*/}
                <Stepper alternativeLabel activeStep={activeStep} className="post-auction-steps">
                    {steps?.map((label) => (
                        <Step key={label} className="step">
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <div className="steps">
                    {getStepContent(activeStep)}

                    {/* Step buttons (Next, Back) */}
                    {activeStep > 0 ? (
                        <Box className="step-nav-buttons" display="flex" justifyContent="center">
                            <Button
                                variant="outlined"
                                className="back-btn"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className="next-btn"
                                onClick={activeStep !== steps.length - 1 ? handleNext : handleOpen}
                            >
                                {activeStep !== steps.length - 1 ? 'Next' : 'Publish'}
                            </Button>
                        </Box>
                    ) : (
                        ''
                    )}
                </div>
            </Container>
            {/*In bottom fixed Next button (For first step only)*/}
            {activeStep === 0 && (
                <Box className="bottom-next-step">
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                    </Button>
                </Box>
            )}
            <PublishAssetModal open={open} handleClose={handleClose} />
        </Box>
    );
};

export default PostAuction;

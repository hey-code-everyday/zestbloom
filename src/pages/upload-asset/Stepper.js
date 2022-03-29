import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Box, Step, StepLabel, Button, Typography } from '@material-ui/core';
import { UploadAssetType } from 'components/shared';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Asset Type', 'Set Information', 'Upload Asset'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Select campaign settings...';
        case 1:
            return 'What is an ad group anyways?';
        case 2:
            return 'This is the bit I really care about!';
        default:
            return 'Unknown stepIndex';
    }
}

export default function HorizontalLabelPositionBelowStepper() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box className="upload-assets">
            <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h4">Upload Asset</Typography>
            </Box>
            <Box display="flex" justifyContent="center" mt={1} mb={5}>
                <Typography variant="body2">Start sharing your treasure.</Typography>
            </Box>
            <UploadAssetType type="single" />
            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                {steps?.map((label) => (
                    <Step key={label}>
                        <StepLabel className="step-label">{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed
                        </Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions} component="span">
                            {getStepContent(activeStep)}
                        </Typography>
                        <Box display="flex" justifyContent="center" mt={5}>
                            {activeStep != 0 && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleNext}
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </div>
                )}
            </div>
        </Box>
    );
}

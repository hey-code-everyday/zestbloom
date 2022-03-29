import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Stepper, Box, Step, StepLabel, Typography } from '@material-ui/core';

import UploadAssetStep1 from './uploadAssetSteps/step1';
import UploadAssetStep2 from './uploadAssetSteps/step2';
import UploadAssetStep3 from './uploadAssetSteps/step3';
import UploadAssetStep4 from './uploadAssetSteps/step4';
import UploadAssetStep5 from './uploadAssetSteps/step5';

import { UPLOAD_ASSET_STEP_TITLES } from 'configs/assetsConfig';
import { useSelector } from 'react-redux';
import LoadingNotFound from 'components/shared/LoadingNotFound';

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
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

const UploadAsset = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [allValues, setAllValues] = useState({});
    const [createdAsset, setCreatedAsset] = useState({});
    const { user, getUserLoading } = useSelector((state) => state.auth);
    const steps = UPLOAD_ASSET_STEP_TITLES;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    function getStepContent(activeStep) {
        switch (activeStep) {
            case 0:
                return (
                    <UploadAssetStep1
                        handleNext={handleNext}
                        classes={classes}
                        setAllValues={setAllValues}
                        allValues={allValues}
                    />
                );
            case 1:
                return (
                    <UploadAssetStep2
                        handleNext={handleNext}
                        classes={classes}
                        handleBack={handleBack}
                        setAllValues={setAllValues}
                        allValues={allValues}
                    />
                );
            case 2:
                return (
                    <UploadAssetStep3
                        handleNext={handleNext}
                        classes={classes}
                        handleBack={handleBack}
                        setAllValues={setAllValues}
                        allValues={allValues}
                        setCreatedAsset={setCreatedAsset}
                    />
                );
            case 3:
                return (
                    <UploadAssetStep4
                        handleNext={handleNext}
                        classes={classes}
                        handleBack={handleBack}
                        createdAsset={createdAsset}
                    />
                );
            case 4:
                return <UploadAssetStep5 handleBack={handleBack} createdAsset={createdAsset} />;
            default:
                return (
                    <UploadAssetStep1
                        handleNext={handleNext}
                        classes={classes}
                        handleBack={handleBack}
                    />
                );
        }
    }

    if (user?.role !== 'creator') return <LoadingNotFound loading={getUserLoading} />;

    return (
        <>
            <Container maxWidth="xl">
                <div
                    className="
                upload-content"
                >
                    <Box className="upload-assets">
                        <Box display="flex" justifyContent="center" mt={3}>
                            <Typography variant="h4">Upload Asset</Typography>
                        </Box>
                        <Box display="flex" justifyContent="center" mt={1} mb={{ xs: 1, sm: 5 }}>
                            <Typography variant="body2">Start sharing your treasure.</Typography>
                        </Box>
                        <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                            {steps?.map((label) => (
                                <Step key={label}>
                                    <StepLabel className="step-label">{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div>{getStepContent(activeStep)}</div>
                    </Box>
                </div>
            </Container>
        </>
    );
};

export default UploadAsset;

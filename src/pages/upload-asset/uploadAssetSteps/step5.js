import React, { useState, useMemo } from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';

import { useDispatch, useSelector } from 'react-redux';
import { create_app, setup_app, complete_app } from 'redux/auction/actions';
import { useUnsavedChangesWarning } from 'hooks';
import LottieContainer from 'components/shared/LottieContainer';
import { auctionCreateValidation } from 'services/yup-schemas/createAssetStep5';
import { setNotification } from 'redux/profile/actions';
import { NOTIFICATIONS } from 'configs';
import { useHistory } from 'react-router';
import { createAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/createAuction';
import AuctionFields from 'components/shared/AuctionFields';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    backButton: {
        marginRight: theme.spacing(1),
    },
}));

const UploadAssetStep5 = ({ handleBack, createdAsset }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [loading, setLoading] = useState(false);
    const nowPlus15Mins = useMemo(() => new Date(Date.now() + 15 * 60 * 1000), []);

    const formik = useFormik({
        initialValues: {
            start_time: nowPlus15Mins,
            end_time: nowPlus15Mins,
            reserve_price: '',
            min_bid_increment: 1,
            snipe_trigger_window: 5,
            snipe_extension_time: 30,
        },
        validationSchema: auctionCreateValidation,
        onSubmit: (values) => {
            onCreateAuction(values);
        },
    });

    const onBack = () => {
        handleBack();
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const startCreatingAuction = () => {
        setLoading(true);
        setDirty();
    };
    const finishCreatingAuction = () => {
        setLoading(false);
        setPristine();
    };

    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        finishCreatingAuction();
    };

    const redirectToProfile = () => history.push(`/profile/${user?.username}`);

    const onCreateApp = async (data) => dispatch(create_app(data));
    const onSetupApp = async (data) => dispatch(setup_app(data));
    const onComplateApp = async (data) => dispatch(complete_app(data));

    const onCreateAuction = async (values) => {
        startCreatingAuction();
        const dateForCreat = {
            node: createdAsset?.nodes?.[0].guid,
            ...values,
        };

        const args = {
            throwError,
            onCreateApp,
            dateForCreat,
            onSetupApp,
            giveNotification,
            onComplateApp,
            finishCreatingAuction,
            redirectToProfile,
        };

        createAuction(args);
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                    <AuctionFields formik={formik} />
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            type="button"
                            onClick={onBack}
                            className={classes.backButton}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        {loading ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '46px',
                                    width: '154px',
                                }}
                                lottieStyles={{ width: '46px' }}
                            />
                        ) : (
                            <Button variant="contained" color="primary" size="large" type="submit">
                                Next
                            </Button>
                        )}
                    </Box>
                </FormikProvider>
            </form>
            {Prompt}
        </>
    );
};

UploadAssetStep5.propTypes = {
    handleBack: PropTypes.func,
    createdAsset: PropTypes.object,
};

export default UploadAssetStep5;

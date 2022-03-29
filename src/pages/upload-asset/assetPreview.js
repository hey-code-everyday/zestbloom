import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAssets, startUpload, finishUpload } from 'redux/asset/actions';
import { getIPFSHash, getAlgorandAccountInfo } from 'redux/algorand/actions';
import {
    Typography,
    DialogContent,
    Dialog,
    Box,
    Button,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@material-ui/core';
import { ThumbUpOutlined, StarBorderOutlined } from '@material-ui/icons';

import PreviewTabs from './PreviewTabs';
import SlickSlider from './Slider';
import ShowMoreText from '../../components/shared/ShowMoreText';

import LottieContainer from 'components/shared/LottieContainer';
import { createAsset } from 'transactions/assetActions/createAssets';
import AlgoFont from '../../assets/img/algo-font.svg';
import { setNotification } from 'redux/profile/actions';
import PeopleMinCard from 'components/elements/cards/peopleMinCard';
import { NOTIFICATIONS } from 'configs';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const AssetPreview = ({
    previewDialog,
    onClosePreviewDialog,
    formValues,
    handleNext,
    setCreatedAsset,
    setDirty,
    setPristine,
    walletFallback,
}) => {
    const dispatch = useDispatch();
    const { selectedWallet } = useSelector((state) => state.profile);
    const user = useSelector((state) => state.auth.user);
    const { loading } = useSelector((state) => state.assets);
    const { zestBloomManagerAddress } = useSelector((state) => state.algorand);
    const [visibility, setVisibility] = useState('private');

    useEffect(() => {
        setVisibility(user?.asset_default_visibility ? 'public' : 'private');
    }, [user]);

    const handleChange = (event) => {
        setVisibility(event.target.value);
    };
    const startingUpload = () => {
        setDirty();
        dispatch(startUpload());
    };

    const endUpload = () => {
        setPristine();
        dispatch(finishUpload());
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };
    const getErrorMessage = (messages, status = 'error') => {
        if (typeof messages === 'object') {
            for (let key in messages) {
                giveNotification({ status, message: messages[key] });
            }
        } else {
            giveNotification({ status, message: messages });
        }
        endUpload();
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
    };

    const gettingIPFSHash = async (data) => {
        return await dispatch(getIPFSHash(data));
    };

    const addAssetToDB = (assetsData) => {
        try {
            dispatch(addAssets(JSON.stringify(assetsData))).then((response) => {
                if (response?.status === 201) {
                    setCreatedAsset(response?.data);
                    endUpload();
                    giveNotification(NOTIFICATIONS.success.uploaded);
                    onClosePreviewDialog();
                    handleNext();
                } else if (response?.status === 400) {
                    const data = response?.data;
                    getErrorMessage(data);
                } else {
                    getErrorMessage(NOTIFICATIONS.error.cantUpload.message);
                }
            });
        } catch (err) {
            getErrorMessage(NOTIFICATIONS.error.cantUpload.message);
            console.log(err);
        }
    };

    const addToBlockchain = async () => {
        try {
            if (!selectedWallet) {
                giveNotification(NOTIFICATIONS.info.connectWallet);
                return;
            }
            startingUpload();
            const account = selectedWallet;
            createAsset({
                file: formValues?.file,
                gettingIPFSHash,
                formValues,
                user,
                account,
                visibility,
                addAssetToDB,
                getErrorMessage,
                zestBloomManagerAddress,
                getAccountInfo,
                walletFallback,
            });
        } catch (error) {
            giveNotification({ status: 'error', message: error?.message });
            endUpload();
            console.log(error);
        }
    };
    return (
        <Dialog
            open={previewDialog}
            onClose={!loading ? onClosePreviewDialog : () => {}}
            scroll="body"
            maxWidth="lg"
            className="asset-preview"
            aria-labelledby="max-width-dialog-title"
        >
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                className="preview-meta"
            >
                <RadioGroup
                    aria-label="state"
                    name="state"
                    value={visibility}
                    className="radio-group"
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="private"
                        control={<Radio color="primary" />}
                        label="Private"
                    />
                    <FormControlLabel
                        value="public"
                        control={<Radio color="primary" />}
                        label="Public"
                    />
                </RadioGroup>

                {loading ? (
                    <LottieContainer
                        containerStyles={{
                            height: '50px',
                            width: '153px',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        onClick={addToBlockchain}
                    >
                        Publish
                    </Button>
                )}
            </Box>
            <DialogContent style={{ padding: 0 }}>
                <Box display="flex" className="asset-preview-content">
                    <Box className="preview-slider">
                        <SlickSlider
                            isSeries={formValues.isSeries}
                            files={
                                formValues.isSeries ? formValues.filesOfSeries : [formValues?.file]
                            }
                        />
                    </Box>
                    <Box className="preview-description">
                        <Typography variant="h4">{formValues.title}</Typography>
                        <Box display="flex" alignItems="center" mt={3}>
                            <Box
                                fontWeight="bold"
                                display="flex"
                                fontSize={16}
                                alignItems="center"
                                color="text.black50"
                            >
                                <ThumbUpOutlined
                                    style={{ fontSize: 24 }}
                                    className="pointer hover-opacity"
                                />
                                <Box component="span" ml={1}>
                                    0
                                </Box>
                            </Box>
                            <Box
                                fontWeight="bold"
                                color="text.black50"
                                display="flex"
                                ml={3}
                                alignItems="center"
                            >
                                <StarBorderOutlined
                                    style={{ fontSize: 24 }}
                                    className="pointer hover-opacity"
                                />
                                <Box component="span" ml={1}>
                                    0
                                </Box>
                            </Box>
                        </Box>
                        <Box color="text.black50" size={16} fontWeight="bold" mt={4}>
                            Creator
                        </Box>
                        <PeopleMinCard
                            tags={user?.selected_tags}
                            author={user?.username}
                            authorAvatar={user?.avatar}
                        />
                        <Box
                            fontSize={20}
                            pb={1}
                            mt={5}
                            mb={2}
                            fontWeight="bold"
                            className="price-algo"
                        >
                            {!!Number(formValues.price) && (
                                <>
                                    <Box
                                        fontSize={32}
                                        lineHeight={1.25}
                                        display="block"
                                        fontWeight="bold"
                                        fontFamily="fontFamily"
                                    >
                                        {Number(formValues.price).toFixed(3)}
                                    </Box>
                                    <img src={AlgoFont} alt="Algo" />
                                </>
                            )}
                        </Box>
                        <ShowMoreText text={formValues.description} max={150} />
                        <Box>
                            <PreviewTabs />
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

AssetPreview.propTypes = {
    previewDialog: PropTypes.bool,
    handleNext: PropTypes.func,
    formValues: PropTypes.object,
    onClosePreviewDialog: PropTypes.func,
    setCreatedAsset: PropTypes.func,
    setDirty: PropTypes.func,
    setPristine: PropTypes.func,
    walletFallback: PropTypes.string,
};

export default withWalletFallback(AssetPreview);

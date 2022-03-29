import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Checkbox } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { assetCreateValidationStep3 } from 'services/yup-schemas/createAssetStep3';
import { ALLOWED_FILE_TYPES } from 'configs/assetsConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from 'redux/profile/actions';
import Thumb from '../assetImage';
import { Logo } from 'components/shared';
import { AddOutlined } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import {
    QUANTITY_MESSAGE,
    ASSET_FROZEN_MESSAGE,
    PHYSICAL_ASSEST_MESSAGE,
    NOTIFICATIONS,
} from 'configs';
import DropdownAsset from 'components/shared/dropdown/dropdown-asset';
import DropdownDesiredSale from 'components/shared/dropdown/dropdown-desiredSale';
// import QuantityValidation from '../quantityValidation';
import Popover from '@material-ui/core/Popover';
import AdvancedInfoModal from 'components/elements/modal/advancedInfoModal';
import AssetPreview from '../assetPreview';
import { maxAssetSize } from 'helpers/functions';
import { getManagerAddress } from 'redux/algorand/actions';
import { v4 as uuid } from 'uuid';
import { useUnsavedChangesWarning } from 'hooks';
import PropTypes from 'prop-types';

const UploadAssetStep3 = ({
    classes,
    handleBack,
    setAllValues,
    allValues,
    handleNext,
    setCreatedAsset,
}) => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(allValues?.file);
    const [fileError, setFileError] = useState(false);
    // const [openQuantityDialog, setOpenQuantityDialog] = useState(false);
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const { user } = useSelector((state) => state.auth);

    const [anchorEl4, setAnchorEl4] = React.useState(null);

    const [advancedModal, setAdvancedModal] = useState(false);

    const [previewDialog, setPreviewDialog] = useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    // Check if count is over 10
    // const [quantityNoRequiredValue, setQuantityNoRequiredValue] = useState(1);

    useEffect(() => {
        dispatch(getManagerAddress());
    }, [dispatch]);

    const openPopover3 = Boolean(anchorEl3);
    const openPopover4 = Boolean(anchorEl4);
    const onOpenPublishDialog = () => {
        setPreviewDialog(true);
    };
    const onClosePreviewDialog = () => {
        setPreviewDialog(false);
    };
    const formik = useFormik({
        initialValues: {
            quantity: allValues?.quantity || 1,
            royalties: allValues?.royalties || `${(10).toFixed(2)} %`,
            frozen: allValues?.frozen || false,
            physical_asset: allValues?.physical_asset || false,
            is_nsfw: allValues?.is_nsfw || false,
            assetManager: allValues?.assetManager || 'creator',
            assetAttributes: allValues?.assetAttributes || [],
            assetContributors: allValues?.assetContributors || [],
            clawbackAddress: allValues?.clawbackAddress || '',
            freezeAddress: allValues?.freezeAddress || '',
        },
        enableReinitialize: true,
        validationSchema: assetCreateValidationStep3,
        enablereinitialize: true,
        onSubmit: (values) => {
            if (!file) {
                return setFileError(true);
            }
            setAllValues((prev) => ({ ...prev, ...values }));
            onOpenPublishDialog();
        },
    });

    const setAssetManager = (value) => {
        formik.setFieldValue('assetManager', value);
    };
    const setDefaultFrozen = (value) => {
        formik.setFieldValue('frozen', value);
    };
    const setClawbackAddress = (e) => {
        formik.setFieldValue('clawbackAddress', e.target.value);
    };
    const setFreezeAddress = (e) => {
        formik.setFieldValue('freezeAddress', e.target.value);
    };

    const onChangeUpload = (e) => {
        const file = e.target.files[0];
        const extensionOfFile = file?.type;
        const maxAllowedSize = maxAssetSize(user?.asset_size_limit);
        const fileSize = file?.size;
        if (!ALLOWED_FILE_TYPES.includes(extensionOfFile)) {
            return giveNotification(NOTIFICATIONS.info.inputTypes);
        }
        if (fileSize > maxAllowedSize) {
            return giveNotification({
                status: NOTIFICATIONS.info.fileSize.status,
                message: NOTIFICATIONS.info.fileSize.message + `${user?.asset_size_limit} MB`,
            });
        }
        setFileError(false);
        setFile(file);
        setAllValues((prev) => ({ ...prev, file }));
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const blurRoyalties = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (!value.match(/%/) && Number(value)) {
            formik.setFieldValue('royalties', `${value} %`);
        }
    };
    const focusRoyalties = (e) => {
        const value = e.target.value.replace(/ |%/g, '');
        formik.setFieldValue('royalties', value);
    };

    const changeRoyalities = (e) => {
        const value = e.target.value.replace(/ |%/g, '');
        const floatPart = value.split('.')[1];
        const decimalsCount = floatPart?.length || 0;
        if (decimalsCount < 3) {
            formik.setFieldValue('royalties', e.target.value);
        }
    };
    // Check if count is over 10
    // const changeQuantity = (e) => {
    //     const value = e.target.value;
    //     if (value > 10) {
    //         setQuantityNoRequiredValue(value);
    //         return setOpenQuantityDialog(true);
    //     }
    //     formik.setFieldValue('quantity', value);
    // };

    const handlePopoverOpen3 = (event) => {
        setAnchorEl3(event.currentTarget);
    };

    const handlePopoverClose3 = () => {
        setAnchorEl3(null);
    };

    const handlePopoverOpen4 = (event) => {
        setAnchorEl4(event.currentTarget);
    };

    const handlePopoverClose4 = () => {
        setAnchorEl4(null);
    };
    const onOpenAdvancedModal = () => {
        onCloseAdvancedModal();
        setAdvancedModal(true);
    };

    const onCloseAdvancedModal = () => {
        setAdvancedModal(false);
    };
    // const confirmQuantityValue = (value) => {
    //     formik.setFieldValue('quantity', value);
    //     setOpenQuantityDialog(false);
    // };
    // const onCloseDialog = () => {
    //     setOpenQuantityDialog(false);
    // };

    const onBack = () => {
        setAllValues((prev) => ({ ...prev, ...formik.values }));
        handleBack();
    };

    const setAttributes = (data) => {
        data.guid = uuid();
        formik.setFieldValue('assetAttributes', [...formik.values.assetAttributes, data]);
    };

    const changeExistsAttributes = (guid, value, key) => {
        const newValue = formik.values.assetAttributes.map((attribute) =>
            attribute.guid === guid ? { ...attribute, [key]: value } : attribute,
        );
        formik.setFieldValue('assetAttributes', newValue);
    };

    const deleteAttributes = (guid) => {
        const newValue = formik.values.assetAttributes.filter(
            (attribute) => attribute.guid !== guid,
        );
        formik.setFieldValue('assetAttributes', newValue);
    };

    const setContributors = (data) => {
        data.guid = uuid();
        formik.setFieldValue('assetContributors', [...formik.values.assetContributors, data]);
    };

    const changeExistsContributor = (guid, value) => {
        const newValue = formik.values.assetContributors.map((contributor) =>
            contributor.guid === guid ? { ...contributor, ...value } : contributor,
        );
        formik.setFieldValue('assetContributors', newValue);
    };

    const deleteContributor = (guid) => {
        const newValue = formik.values.assetContributors.filter(
            (contributor) => contributor.guid !== guid,
        );
        formik.setFieldValue('assetContributors', newValue);
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                    <Typography className={classes.instructions} component="span">
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={2}
                            className="inner-padd"
                        >
                            <Grid item xs={12} sm={5} md={5}>
                                <Box
                                    mb={1}
                                    px={4}
                                    py={4}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    textAlign="center"
                                    className="upload-card"
                                >
                                    <Box
                                        my="auto"
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <div className="logo-with-icon">
                                            {file ? (
                                                <Thumb file={file} style={{ width: '100%' }} />
                                            ) : (
                                                <>
                                                    <Logo type="logoIcon" width="167" />
                                                    <span>
                                                        <AddOutlined style={{ fontSize: 42 }} />
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <Box
                                            className="white-card-text"
                                            fontSize={20}
                                            fontWeight="bold"
                                            fontFamily="h1.fontFamily"
                                            mt={3}
                                        >
                                            Upload File
                                        </Box>
                                    </Box>
                                    <Box mt={4}>
                                        <Field
                                            field="input"
                                            type="file"
                                            name="file"
                                            onChange={onChangeUpload}
                                            className="upload-assets-button"
                                        />
                                        {fileError && !file && (
                                            <span style={{ color: 'red' }}>File is required</span>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={7} md={6}>
                                <Field
                                    field="input"
                                    type="text"
                                    label="Royalties"
                                    name="royalties"
                                    {...formik.getFieldProps('royalties')}
                                    onFocus={focusRoyalties}
                                    onBlur={blurRoyalties}
                                    onChange={changeRoyalities}
                                />
                                <Field
                                    field="input"
                                    type="number"
                                    label="Quantity"
                                    tooltip={QUANTITY_MESSAGE}
                                    name="quantity"
                                    {...formik.getFieldProps('quantity')}
                                    // onChange={changeQuantity}
                                />
                                <Box mb={3} style={{ position: 'relative', zIndex: 3 }}>
                                    <DropdownAsset
                                        assetManager={formik.values.assetManager}
                                        setAssetManager={setAssetManager}
                                    />
                                </Box>
                                <Box style={{ position: 'relative', zIndex: 2 }}>
                                    <Typography className="asset-item-title">
                                        Desired Sale Structure
                                        <i
                                            className="popover-icon icon-information-outline"
                                            aria-owns={
                                                openPopover3 ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen3}
                                            onMouseLeave={handlePopoverClose3}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </Typography>
                                    <DropdownDesiredSale
                                        defaultFrozen={formik.values.frozen}
                                        setDefaultFrozen={setDefaultFrozen}
                                    />
                                </Box>
                                <Box mt={2} mb={2} display="flex" alignItems="center">
                                    <Checkbox
                                        name="physical_asset"
                                        color="primary"
                                        style={{ marginLeft: '-11px' }}
                                        checked={formik.values.physical_asset}
                                        {...formik.getFieldProps('physical_asset')}
                                        //disabled
                                    />
                                    <Typography variant="body2" component="strong">
                                        Physical asset
                                        <i
                                            className="popover-icon icon-information-outline"
                                            aria-owns={
                                                openPopover4 ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen4}
                                            onMouseLeave={handlePopoverClose4}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </Typography>
                                </Box>
                                <Box mt={2} mb={2} display="flex" alignItems="center">
                                    <Checkbox
                                        name="is_nsfw"
                                        color="primary"
                                        style={{ marginLeft: '-11px' }}
                                        checked={formik.values.is_nsfw}
                                        {...formik.getFieldProps('is_nsfw')}
                                        //disabled
                                    />
                                    <Typography variant="body2" component="strong">
                                        NSFW
                                        {/* <i
                                            className="popover-icon icon-information-outline"
                                            aria-owns={
                                                openPopover4 ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen4}
                                            onMouseLeave={handlePopoverClose4}
                                            style={{ marginLeft: 8 }}
                                        /> */}
                                    </Typography>
                                </Box>
                                <Box>
                                    <button
                                        color="primary"
                                        type="button"
                                        className="hover-opacity"
                                        style={{
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            color: '#323fb1',
                                        }}
                                        onClick={onOpenAdvancedModal}
                                    >
                                        Advanced
                                    </button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={onBack}
                            className={classes.backButton}
                        >
                            Back
                        </Button>
                        <Button variant="contained" color="primary" size="large" type="submit">
                            Next
                        </Button>
                    </Box>
                </FormikProvider>
            </form>
            {/* Check if count is over 10 */}
            {/* <QuantityValidation
                openQuantityDialog={openQuantityDialog}
                onCloseDialog={onCloseDialog}
                quantityNoRequiredValue={quantityNoRequiredValue}
                confirmQuantityValue={confirmQuantityValue}
            /> */}
            <Popover
                className={`${classes.popover} info-popover`}
                classes={{
                    paper: classes.paper,
                }}
                open={openPopover3}
                anchorEl={anchorEl3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose3}
                disableRestoreFocus
            >
                <Typography>{ASSET_FROZEN_MESSAGE}</Typography>
            </Popover>

            <Popover
                className={`${classes.popover} info-popover`}
                classes={{
                    paper: classes.paper,
                }}
                open={openPopover4}
                anchorEl={anchorEl4}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose4}
                disableRestoreFocus
            >
                <Typography>{PHYSICAL_ASSEST_MESSAGE}</Typography>
            </Popover>
            <AdvancedInfoModal
                open={advancedModal}
                close={onCloseAdvancedModal}
                defaultFrozen={formik.values.frozen}
                assetAttributes={formik.values.assetAttributes}
                setAttributes={setAttributes}
                changeExistsAttributes={changeExistsAttributes}
                deleteAttributes={deleteAttributes}
                assetContributors={formik.values.assetContributors}
                changeExistsContributor={changeExistsContributor}
                deleteContributor={deleteContributor}
                setContributors={setContributors}
                assetManager={formik.values.assetManager}
                clawbackAddress={formik.values.clawbackAddress}
                setClawbackAddress={setClawbackAddress}
                freezeAddress={formik.values.freezeAddress}
                setFreezeAddress={setFreezeAddress}
            />
            <AssetPreview
                formValues={allValues}
                previewDialog={previewDialog}
                onClosePreviewDialog={onClosePreviewDialog}
                handleNext={handleNext}
                setCreatedAsset={setCreatedAsset}
                setDirty={setDirty}
                setPristine={setPristine}
            />
            {Prompt}
        </>
    );
};

UploadAssetStep3.propTypes = {
    handleNext: PropTypes.func,
    classes: PropTypes.object,
    setAllValues: PropTypes.func,
    allValues: PropTypes.object,
    handleBack: PropTypes.func,
    setCreatedAsset: PropTypes.func,
};

export default UploadAssetStep3;

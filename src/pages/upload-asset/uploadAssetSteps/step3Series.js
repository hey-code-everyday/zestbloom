import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Checkbox, Link } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { assetCreateValidationStep3 } from 'services/yup-schemas/createAssetStep3';

import { ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS } from 'configs/assetsConfig';
import { useDispatch } from 'react-redux';

import { setNotification } from 'redux/profile/actions';
import Thumb from '../assetImage';
import { Logo } from 'components/shared';
import { AddOutlined } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import DropdownAsset from 'components/shared/dropdown/dropdown-asset';
import DropdownDesiredSale from 'components/shared/dropdown/dropdown-desiredSale';
import QuantityValidation from '../quantityValidation';
import Popover from '@material-ui/core/Popover';
import AdvancedInfoModal from 'components/elements/modal/advancedInfoModal';
import AssetPreview from '../assetPreview';
import { UNIT_NAME_MESSAGE } from 'configs';

import bannerImg1 from 'assets/img/banner-img1.png';

const UploadAssetStep3Series = ({ handleNext, classes, handleBack }) => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [quantityNoRequiredValue, setQuantityNoRequiredValue] = useState(1);
    const [openQuantityDialog, setOpenQuantityDialog] = useState(false);
    const [assetManager, setAssetManager] = useState('creator');
    const [anchorEl3, setAnchorEl3] = React.useState(null);

    const [advancedModal, setAdvancedModal] = useState(false);

    const [assetSale, setAssetSale] = useState();

    const [previewDialog, setPreviewDialog] = useState(false);

    const openPopover3 = Boolean(anchorEl3);
    const onOpenPublishDialog = () => {
        setPreviewDialog(true);
    };

    const onClosePreviewDialog = () => {
        setPreviewDialog(false);
    };

    const formik = useFormik({
        initialValues: {
            quantity: 1,
            royalties: `${(10).toFixed(2)} %`,
            frozen: true,
            physical_asset: false,
            price: (0).toFixed(3),
            seriesPrice: '',
            termsAndPrivacy: '',
            price_is_visible: false,
        },
        validationSchema: assetCreateValidationStep3,
        enablereinitialize: true,
        onSubmit: (values) => {
            if (!file) {
                return setFileError(true);
            }
            onOpenPublishDialog();
        },
    });

    const handlePopoverClose3 = () => {
        setAnchorEl3(null);
    };

    const onCloseAdvancedModal = () => {
        setAdvancedModal(false);
    };
    const confirmQuantityValue = (value) => {
        formik.setFieldValue('quantity', value);
        setOpenQuantityDialog(false);
    };
    const onCloseDialog = () => {
        setOpenQuantityDialog(false);
    };

    const onChangeUnitname = (e) => {
        const value = e.target.value;
        if (value.length > 8) {
            return;
        }
        // formik.setFieldValue('unitName', e.target.value);
    };
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                    <Typography className={classes.instructions} component="span">
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item md={6}>
                                <Box pr={3}>
                                    {/*<Box
                                mt={2}
                                mb={2}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography variant="body2" component="strong">
                                    Add to Marketplace
                                    <i
                                        className="popover-icon icon-information-outline"
                                        aria-owns={
                                            openPopover2 ? 'mouse-over-popover' : undefined
                                        }
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen2}
                                        onMouseLeave={handlePopoverClose2}
                                        style={{ marginLeft: 8 }}
                                    />
                                </Typography>
                                <Switch
                                    checked={switchState.checkedB}
                                    onChange={handleSwitch}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Box>
                            <Field
                                field="input"
                                type="text"
                                label="Price of Series"
                                name="seriesPrice"
                                className="no-margin"
                                {...formik.getFieldProps('seriesPrice')}
                                onChange={changePrice}
                            />*/}
                                    <Box mt={2} mb={2} display="flex" alignItems="center">
                                        <Checkbox
                                            name="termsAndPrivacy"
                                            color="primary"
                                            style={{ marginLeft: '-11px' }}
                                            checked={Boolean(formik.values.termsAndPrivacy)}
                                            onChange={formik.handleChange}
                                            disabled
                                        />
                                        <Typography variant="body2" component="strong">
                                            Series of Physical Assets
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item md={6}>
                                            <Box
                                                className="wallet-card w-auto"
                                                component="li"
                                                mx={0}
                                            >
                                                <Logo type="logoIconGray" width="53" />
                                                <Typography
                                                    variant="body2"
                                                    component="strong"
                                                    className="name"
                                                >
                                                    Upload Files
                                                </Typography>
                                                <Link to="/">Upload</Link>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6}>
                                            <img
                                                className="uploaded-image active"
                                                src={bannerImg1}
                                                alt="dummy"
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <img
                                                className="uploaded-image"
                                                src={bannerImg1}
                                                alt="dummy"
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <img
                                                className="uploaded-image"
                                                src={bannerImg1}
                                                alt="dummy"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Field
                                    field="input"
                                    type="text"
                                    label="name"
                                    name="name"
                                    {...formik.getFieldProps('name')}
                                />
                                <Field
                                    field="input"
                                    type="text"
                                    label="Unit Name (optional)"
                                    tooltip={UNIT_NAME_MESSAGE}
                                    name="unitName"
                                    {...formik.getFieldProps('unitName')}
                                    onChange={onChangeUnitname}
                                />
                                <Field
                                    field="input"
                                    type="text"
                                    label="Description"
                                    name="description"
                                    className="no-margin"
                                    {...formik.getFieldProps('description')}
                                />
                                {/*<Box
                            mt={2}
                            mb={2}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="body2" component="strong">
                                Add to Marketplace
                                <i
                                    className="popover-icon icon-information-outline"
                                    aria-owns={openPopover2 ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen2}
                                    onMouseLeave={handlePopoverClose2}
                                    style={{ marginLeft: 8 }}
                                />
                            </Typography>
                            <Switch
                                checked={switchState.checkedA}
                                onChange={handleSwitch}
                                color="primary"
                                name="checkedA"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </Box>
                        <Field
                            field="input"
                            type="text"
                            label="Price"
                            name="price"
                            className="no-margin"
                            {...formik.getFieldProps('price')}
                            onChange={changePrice}
                        />*/}
                                <Box mt={2} mb={2} display="flex" alignItems="center">
                                    <Checkbox
                                        name="termsAndPrivacy"
                                        color="primary"
                                        style={{ marginLeft: '-11px' }}
                                        checked={Boolean(formik.values.termsAndPrivacy)}
                                        onChange={formik.handleChange}
                                    />
                                    {/*<Typography variant="body2" component="strong">
                                Add to Marketplace
                                <i
                                    className="popover-icon icon-information-outline"
                                    aria-owns={openPopover2 ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen2}
                                    onMouseLeave={handlePopoverClose2}
                                    style={{ marginLeft: 8 }}
                                />
                            </Typography>*/}
                                </Box>
                            </Grid>
                        </Grid>
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={handleBack}
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
            <QuantityValidation
                openQuantityDialog={openQuantityDialog}
                onCloseDialog={onCloseDialog}
                quantityNoRequiredValue={quantityNoRequiredValue}
                confirmQuantityValue={confirmQuantityValue}
            />
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
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem eos, est
                    excepturi iure maiores nulla rem? Eos excepturi possimus soluta. A alias,
                    aliquid consequuntur itaque minima nulla quasi vitae. Voluptas!
                </Typography>
            </Popover>
            <AdvancedInfoModal open={advancedModal} close={onCloseAdvancedModal} />
            <AssetPreview
                formValues={{
                    // ...formik.values,
                    // ...formikStep3.values,
                    isSeries: false,
                    assetManager,
                }}
                file={file}
                previewDialog={previewDialog}
                onClosePreviewDialog={onClosePreviewDialog}
            />
        </>
    );
};

export default UploadAssetStep3Series;

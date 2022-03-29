import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Popover,
    Radio,
    RadioGroup,
    Switch,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, FormikProvider } from 'formik';
import Field from 'components/shared/fields/Field';
import ButtonTag from 'components/shared/ButtonTag';
import LottieContainer from 'components/shared/LottieContainer';
import DropdownSaleType from 'components/shared/dropdown/dropdown-saleType';
import { threeDecimals } from 'helpers/functions';
import { getSaleAmountEditPage, getNetAmount } from 'helpers/functions';
import { EDIT_PAGE_CONFIG } from 'configs';
import { addAssetsTags } from 'redux/marketplace/actions';
import AssetImage from '../assetImage';
import AuctionFields from 'components/shared/AuctionFields';
import {
    editAssetValidation,
    editDefaultValidation,
} from 'services/yup-schemas/editAssetValidation';
import { auctionCreateValidation } from 'services/yup-schemas/createAssetStep5';
import { useAlgoFont } from 'hooks/assets';
import PropTypes from 'prop-types';

// import AdvancedInfoModal from 'components/elements/modal/advancedInfoModal';
// import { v4 as uuid } from 'uuid';
// import AuctionSettingsModal from 'components/elements/modal/auctionSettingsModal';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

const AssetEdit = ({
    updateSaleByEscrow,
    loaderValue,
    onOpenConfirmModal,
    deleteLoading,
    showDeleteBtn,
    addMinOffer,
    onCreateAuction,
    selectedNode,
}) => {
    const dispatch = useDispatch();
    const { assetsTags } = useSelector((state) => state.marketplace);
    const { currentAsset } = useSelector((state) => state.singleAsset);
    const [tags, setTags] = useState(currentAsset?.media_types || []);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [popUpInfo, setpopUpInfo] = useState(null);
    const [netAmount, setNetAmount] = useState(0);
    const [zestBloomPercent, setZestBloomPercent] = useState(0);
    // const [advancedModalVisible, setAdvancedModalVisible] = useState(false);
    const AlgoFont = useAlgoFont();

    const isCreator = useMemo(() => selectedNode?.user_type === 'creator', [selectedNode]);

    // const openAdvancedModal = () => setAdvancedModalVisible(true);
    // const closeAdvancedModal = () => setAdvancedModalVisible(false);

    useEffect(() => {
        if (selectedNode?.sales?.length !== 0) {
            const netValue = (selectedNode?.sales[0]?.teal_context?.sale_amount / 1000000).toFixed(
                3,
            );
            setNetAmount(netValue);
        }
    }, [selectedNode]);

    useEffect(() => {
        setTags(currentAsset?.media_types || []);
    }, [currentAsset]);

    useEffect(() => {
        setZestBloomPercent(
            isCreator ? currentAsset?.fees?.primary : currentAsset?.fees?.secondary,
        );
    }, [isCreator, currentAsset]);

    const handlePopoverOpen = (event, info) => {
        setAnchorEl(event.currentTarget);
        setpopUpInfo(info);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    const nowPlus15Mins = useMemo(() => new Date(Date.now() + 15 * 60 * 1000), []);

    const formik = useFormik({
        initialValues: {
            price_is_visible: selectedNode?.price_is_visible || false,
            price: (selectedNode && selectedNode?.sales?.length !== 0
                ? getSaleAmountEditPage(selectedNode?.sales[0], true)
                : 0
            ).toFixed(3),
            tags: currentAsset?.media_types
                ? JSON.stringify(currentAsset?.media_types.map((x) => x.slug))
                : '',
            visibility: selectedNode?.visibility || 'private',
            custom_tag: '',
            physical_asset: currentAsset.physical_entity,
            frozen: false,
            assetManager: selectedNode?.user_type,
            assetAttributes: [],
            clawbackAddress: currentAsset.asset.clawback_address ?? '',
            freezeAddress: currentAsset.asset.freeze_address ?? '',
            contractType: 'list-price-escrow',
            reserve_price: '',
            min_bid_increment: 1,
            snipe_trigger_window: 5,
            snipe_extension_time: 30,
            start_time: nowPlus15Mins,
            end_time: nowPlus15Mins,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            onSubmitBtn(values);
        },
    });

    const isSaleByEscrow = formik.values.contractType === 'list-price-escrow';

    function validationSchema() {
        if (formik.values.contractType === 'auction-escrow') return auctionCreateValidation;
        if (isSaleByEscrow && formik.values.price_is_visible) return editAssetValidation;
        return editDefaultValidation;
    }

    function onSubmitBtn(values) {
        switch (values.contractType) {
            case 'list-price-escrow':
                return updateSaleByEscrow(values);
            case 'list-for-offer':
                return addMinOffer(values);
            case 'auction-escrow':
                return onCreateAuction(values);
            default:
                return null;
        }
    }

    const setContractType = (value) => {
        formik.setFieldValue('contractType', value);
    };

    const updateTagsInfo = (value) => {
        const data = JSON.stringify(value.map((x) => x.slug));
        formik.setFieldValue('tags', data);
        setTags(value);
    };

    const onSelectTag = (tag) => {
        const exist = tags.find((x) => x.category === tag.category);
        if (exist && exist.slug === tag.slug) {
            const value = tags.filter((x) => x.slug !== tag.slug);
            updateTagsInfo(value);
        } else if (exist) {
            const value = [...tags.filter((x) => x.category !== tag.category), tag];
            updateTagsInfo(value);
        } else {
            const value = [...tags, tag];
            updateTagsInfo(value);
        }
    };

    function getTotalAmount(price) {
        const netValue = getNetAmount(isCreator, price, zestBloomPercent, currentAsset?.royalties);

        const decimalsCount = netValue?.toString()?.split('.')[1]?.length > 6;

        if (decimalsCount) {
            return setNetAmount(netValue.toFixed(6));
        }
        setNetAmount(netValue);
    }

    function addCustomTag(event) {
        if (
            (event.charCode || event.keyCode) === 13 &&
            event.target.name === 'custom_tag' &&
            event.target.value
        ) {
            dispatch(addAssetsTags(event.target.value));
            formik.values.custom_tag = '';
        }
    }

    const handleChangeVisibility = (event) => {
        formik.setFieldValue('visibility', event.target.value);
    };

    const changePrice = (e) => {
        const value = e.target.value;
        const lessThreeDecimal = threeDecimals(value);
        if (lessThreeDecimal) {
            formik.setFieldValue('price', value);
            getTotalAmount(value);
        }
    };

    const showPrice =
        formik.values.contractType === 'list-price-escrow' ||
        formik.values.contractType === 'list-for-offer';
    const showNetAmount = formik.values.contractType === 'list-price-escrow';
    const showAuctionFields = formik.values.contractType === 'auction-escrow';

    return (
        <>
            <Container maxWidth="xl" className="edit-asset">
                <Typography variant="h4" style={{ marginBottom: '1.75rem' }}>
                    {currentAsset?.title}
                </Typography>
                <Box display="flex" className="edit-asset-body">
                    <Box className="edit-asset-left">
                        <AssetImage currentAsset={{ ...currentAsset }} />
                    </Box>
                    <Box className="edit-asset-right">
                        <form onSubmit={formik.handleSubmit}>
                            <FormikProvider value={formik}>
                                {isCreator && (
                                    <Box mb={3}>
                                        <Typography variant="subtitle2">Media Type</Typography>
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="center"
                                            flexWrap="wrap"
                                            mt={1}
                                        >
                                            {assetsTags?.map((item) => (
                                                <ButtonTag
                                                    key={item.slug}
                                                    text={item.name}
                                                    slug={item.slug}
                                                    icon={item.icon}
                                                    selected={
                                                        !!tags.find((x) => x.slug === item.slug)
                                                    }
                                                    onSelectTagFromUpload={onSelectTag}
                                                    category={item.category}
                                                />
                                            ))}{' '}
                                            <Box className="custom-label">
                                                <Box className="new-label">
                                                    <i
                                                        className="icon-label"
                                                        style={{ fontSize: 24 }}
                                                    />
                                                    <Field
                                                        field="input"
                                                        type="text"
                                                        className="no-margin"
                                                        placeholder="Add Custom"
                                                        name="custom_tag"
                                                        onKeyDown={addCustomTag}
                                                        {...formik.getFieldProps('custom_tag')}
                                                    />
                                                </Box>
                                                <i
                                                    className="popover-icon icon-information-outline"
                                                    aria-owns={
                                                        openPopover
                                                            ? 'mouse-over-popover'
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    onMouseEnter={(e) =>
                                                        handlePopoverOpen(
                                                            e,
                                                            EDIT_PAGE_CONFIG.tagsConfig,
                                                        )
                                                    }
                                                    onMouseLeave={handlePopoverClose}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                                {isSaleByEscrow && (
                                    <Box mb={1}>
                                        <Typography
                                            variant="body2"
                                            component="strong"
                                            style={{ marginRight: 48 }}
                                        >
                                            List on Marketplace
                                        </Typography>
                                        <Switch
                                            checked={formik.values.price_is_visible}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                            {...formik.getFieldProps('price_is_visible')}
                                            color="primary"
                                        />
                                    </Box>
                                )}
                                <Box my={4}>
                                    <DropdownSaleType
                                        contractType={formik.values.contractType}
                                        setContractType={setContractType}
                                    />
                                </Box>
                                <Box mb={3} className="edit-visibility">
                                    <Typography variant="subtitle2">Visibility</Typography>
                                    <Box display="flex" mb={2}>
                                        <RadioGroup
                                            aria-label="state"
                                            name="state"
                                            value={formik.values.visibility}
                                            className="radio-group"
                                            onChange={handleChangeVisibility}
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <FormControlLabel
                                                value="private"
                                                control={<Radio color="primary" />}
                                                label="Private"
                                                style={{ marginRight: 24 }}
                                            />
                                            <FormControlLabel
                                                value="public"
                                                control={<Radio color="primary" />}
                                                label="Public"
                                            />
                                        </RadioGroup>
                                    </Box>
                                    {/*  Physical asset checkbox */}
                                    {/* <Box display="flex" alignItems="center">
                                        <FormControlLabel
                                            value="physical_asset"
                                            control={<Checkbox color="primary" />}
                                            label="Physical asset"
                                            labelPlacement="end"
                                            checked={formik.values.physical_asset}
                                            {...formik.getFieldProps('physical_asset')}
                                        />
                                    </Box> */}
                                </Box>
                                {showPrice && (
                                    <Box className="edit-price">
                                        {/* <Typography variant="subtitle2">Price</Typography> */}
                                        <FormControl fullWidth variant="outlined">
                                            {/* <OutlinedInput
                                    type="number"
                                    name="price"
                                    disabled={!formik.values.price_is_visible}
                                    {...formik.getFieldProps('price')}
                                    endAdornment={
                                        <InputAdornment position="end">ALGO</InputAdornment>
                                    }
                                /> */}
                                            <Box className="price-field">
                                                <Field
                                                    field="input"
                                                    type="number"
                                                    label="Price"
                                                    name="price"
                                                    disabled={
                                                        isSaleByEscrow &&
                                                        !formik.values.price_is_visible
                                                    }
                                                    {...formik.getFieldProps('price')}
                                                    onChange={changePrice}
                                                />
                                                <Box className="price-field-algo">
                                                    <img src={AlgoFont} alt="Algo" />
                                                </Box>
                                            </Box>
                                        </FormControl>
                                    </Box>
                                )}
                                {showNetAmount && (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        className="total"
                                        mb={4}
                                    >
                                        <Box className="total-title">
                                            <Typography variant="body2">
                                                Net amount you will receive
                                                <i
                                                    className="icon-information-outline"
                                                    aria-owns={
                                                        openPopover
                                                            ? 'mouse-over-popover'
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    onMouseEnter={(e) =>
                                                        handlePopoverOpen(
                                                            e,
                                                            EDIT_PAGE_CONFIG.netAmount(
                                                                zestBloomPercent,
                                                            ),
                                                        )
                                                    }
                                                    onMouseLeave={handlePopoverClose}
                                                    style={{ marginLeft: 5 }}
                                                />
                                            </Typography>
                                        </Box>
                                        <Box className="total-price price-algo">
                                            <Typography variant="body2">{netAmount}</Typography>
                                            <img src={AlgoFont} alt="Algo" />
                                        </Box>
                                    </Box>
                                )}
                                {showAuctionFields && (
                                    <Box mb={4}>
                                        <AuctionFields formik={formik} />
                                    </Box>
                                )}

                                <Box
                                    className="edit-buttons"
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    {/* <Button variant="outlined" className="cancel-btn">
                                Cancel
                            </Button> */}
                                    {showDeleteBtn &&
                                        (deleteLoading ? (
                                            <div>
                                                <LottieContainer
                                                    containerStyles={{
                                                        height: '50px',
                                                        width: '153px',
                                                    }}
                                                    lottieStyles={{ width: '50px' }}
                                                />
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                className={classes.button}
                                                style={{
                                                    color: 'red',
                                                    borderColor: 'red',
                                                    marginRight: '10px',
                                                }}
                                                onClick={onOpenConfirmModal}
                                                disabled={loaderValue}
                                            >
                                                Delete
                                            </Button>
                                        ))}
                                    {loaderValue ? (
                                        <div>
                                            <LottieContainer
                                                containerStyles={{
                                                    height: '50px',
                                                    width: '153px',
                                                }}
                                                lottieStyles={{ width: '50px' }}
                                            />
                                        </div>
                                    ) : (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={deleteLoading}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </Box>
                            </FormikProvider>
                        </form>
                    </Box>
                </Box>
            </Container>
            <Popover
                className={`${classes.popover} info-popover`}
                classes={{
                    paper: classes.paper,
                }}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>{popUpInfo}</Typography>
            </Popover>
        </>
    );
};

AssetEdit.propTypes = {
    updateSaleByEscrow: PropTypes.func,
    loaderValue: PropTypes.bool,
    onOpenConfirmModal: PropTypes.func,
    deleteLoading: PropTypes.bool,
    showDeleteBtn: PropTypes.bool,
    addMinOffer: PropTypes.func,
    onCreateAuction: PropTypes.func,
    selectedNode: PropTypes.object,
};

export default AssetEdit;

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { assetCreateValidationStep2 } from 'services/yup-schemas/createAssetStep2';
import Field from 'components/shared/fields/Field';

import { UNIT_NAME_MESSAGE, CUSTOM_TAG_MESSAGE } from 'configs';
import { useDispatch, useSelector } from 'react-redux';

import ButtonTag from 'components/shared/ButtonTag';

import { addAssetsTags } from 'redux/marketplace/actions';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';

const UploadAssetStep2 = ({ handleNext, classes, handleBack, setAllValues, allValues }) => {
    const dispatch = useDispatch();
    const { assetsTags } = useSelector((state) => state.marketplace);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openPopover = Boolean(anchorEl);

    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (allValues?.tag) {
            const initialTags = JSON.parse(allValues?.tag);
            const selectedTags = assetsTags?.filter((x) => initialTags?.includes(x.slug));
            setTags(selectedTags);
        }
    }, [allValues, assetsTags]);

    const formik = useFormik({
        initialValues: {
            title: allValues?.title || '',
            unitName: allValues?.unitName || 'NFT',
            description: allValues?.description || '',
            tag: allValues?.tag || '',
            custom_tag: allValues?.custom_tag || '',
        },
        enableReinitialize: true,
        validationSchema: assetCreateValidationStep2,
        onSubmit: (values) => {
            setAllValues((prev) => ({ ...prev, ...values }));
            handleNext();
        },
    });

    const onChangeUnitname = (e) => {
        const value = e.target.value;
        if (value.length > 8) {
            return;
        }
        formik.setFieldValue('unitName', e.target.value);
    };

    const updateTagsInfo = (value) => {
        delete formik.errors.tag;
        const tagValues = JSON.stringify(value.map((x) => x.slug));
        formik.setFieldValue('tag', tagValues);
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

    function addCustomTag(event) {
        if (
            (event.charCode || event.keyCode) === 13 &&
            event.target.name === 'custom_tag' &&
            event.target.value
        ) {
            dispatch(addAssetsTags(event.target.value));
            formik.values.custom_tag = '';
            event.preventDefault();
        }
    }
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const onBack = () => {
        setAllValues((prev) => ({ ...prev, ...formik.values }));
        handleBack();
    };
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                    <Typography className={classes.instructions} component="span">
                        <Box>
                            <Field
                                field="input"
                                type="text"
                                label="Title"
                                name="title"
                                {...formik.getFieldProps('title')}
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
                                multiline={true}
                                rows={4}
                                {...formik.getFieldProps('description')}
                            />

                            {/* START: Only for multiple type */}
                            {/* {isSeries && (
                                <Grid container justifyContent="space-between" spacing={2}>
                                    <Grid item md={6}>
                                        <Field
                                            field="input"
                                            type="text"
                                            label="Royalties"
                                            name="royalties"
                                            {...formik.getFieldProps('royalties')}
                                            onBlur={blurRoyalties}
                                            onChange={changeRoyalities}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Field
                                            field="input"
                                            type="number"
                                            label="Quantity"
                                            tooltip={QUANTITY_MESSAGE}
                                            name="quantity"
                                            {...formik.getFieldProps('quantity')}
                                            onChange={changeQuantity}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            )} */}
                            {/* END: Only for multiple type */}

                            <Box>
                                <Typography variant="body1" className="label">
                                    {!!formik.errors.tag && formik.touched.tag ? (
                                        <span style={{ color: 'red' }}>Tags are required</span>
                                    ) : (
                                        'Media Type'
                                    )}
                                </Typography>
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
                                            selected={!!tags.find((x) => x.slug === item.slug)}
                                            onSelectTagFromUpload={onSelectTag}
                                            category={item.category}
                                        />
                                    ))}
                                    <Box className="custom-label">
                                        <Box className="new-label">
                                            <i className="icon-label" style={{ fontSize: 24 }} />
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
                                                openPopover ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen}
                                            onMouseLeave={handlePopoverClose}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
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
                <Typography>{CUSTOM_TAG_MESSAGE}</Typography>
            </Popover>
        </>
    );
};

UploadAssetStep2.propTypes = {
    handleNext: PropTypes.func,
    classes: PropTypes.object,
    setAllValues: PropTypes.func,
    allValues: PropTypes.object,
    handleBack: PropTypes.func,
};

export default UploadAssetStep2;

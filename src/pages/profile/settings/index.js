import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import Banner from '../Banner';
import BackButton from 'components/shared/backButton';
import { Box, Grid, Button, Typography, Link } from '@material-ui/core';
import { Facebook, Instagram, Twitter, Pinterest } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import { useFormik, FormikProvider } from 'formik';
import WalletCard from 'components/shared/WalletCard';
import ChangeEmail from './changeEmail';
import ChangePassword from './changePassword';
import ChangeImage from './changeImage';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomTag, updateProfile } from 'redux/profile-settings/actions';
import { getUser } from 'redux/auth/actions';
import { useHistory } from 'react-router-dom';
import { updateProfileValidation } from 'services/yup-schemas/updateProfileValidation';
import Tag from './Tag';
import AllowComponent from './allowingField';
import { ANONYMOUS, NOTIF_LIST, VISIBILITY_LIST } from 'configs';
import LoadingNotFound from 'components/shared/LoadingNotFound';

const ProfileSettings = () => {
    const [emailDialog, setEmailDialog] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [, setSuccess] = useState(false);

    const { user, getUserLoading } = useSelector((state) => state.auth);
    const { myAlgoAccounts } = useSelector((state) => state.profile);
    const history = useHistory();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            firstName: user?.first_name ?? '',
            lastName: user?.last_name ?? '',
            username: user?.username ?? '',
            bio: user?.bio ?? '',
            facebook: user?.social_facebook ?? '',
            twitter: user?.social_twitter ?? '',
            instagram: user?.social_instagram ?? '',
            pinterest: user?.social_pinterest ?? '',
            app_notify: user?.app_notify ?? false,
            email_notify: user?.email_notify ?? false,
            creation_visibility: user?.creation_visibility ?? false,
            asset_default_visibility: user?.asset_default_visibility ?? false,
            sale_amount_visibility: user?.sale_amount_visibility ?? false,
            custom_label: '',
        },
        enableReinitialize: true,
        validationSchema: updateProfileValidation,
        onSubmit: (values) => {
            const params = {
                first_name: values.firstName,
                last_name: values.lastName,
                bio: values.bio,
                social_facebook: values.facebook,
                social_twitter: values.twitter,
                social_instagram: values.instagram,
                social_pinterest: values.pinterest,
                username: values.username,
                app_notify: values.app_notify,
                email_notify: values.email_notify,
                creation_visibility: values.creation_visibility,
                asset_default_visibility: values.asset_default_visibility,
                sale_amount_visibility: values.sale_amount_visibility,
            };
            dispatch(updateProfile(params))
                .then(() => {
                    dispatch(getUser('me'));
                    setSuccess(true);
                    history.push(`/profile/${user?.username}`);
                })
                .catch(() => {
                    setSuccess(false);
                });
        },
    });

    if (Object.values(user).length === 0 || user?.role === ANONYMOUS)
        return <LoadingNotFound loading={getUserLoading} />;

    const { setFieldValue } = formik;

    function onKeyDown(event) {
        if ((event.charCode || event.keyCode) === 13 && event.target.name === 'custom_label') {
            event.preventDefault();
            dispatch(addCustomTag(event.target.value))
                .then((response) => {
                    setFieldValue('custom_label', '');
                })
                .catch(() => {
                    setFieldValue('custom_label', '');
                });
        }
    }

    const onOpenEmailDialog = () => {
        setEmailDialog(true);
    };
    const onCloseEmailDialog = () => {
        setEmailDialog(false);
    };
    const onOpenPasswordDialog = () => {
        setPasswordDialog(true);
    };
    const onClosePasswordDialog = () => {
        setPasswordDialog(false);
    };
    const cancelSettings = () => {
        history.push(`/profile/${user?.username}`);
    };

    return (
        <>
            <Banner readOnly />
            <Container maxWidth="lg">
                <form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
                    <div className="settings-content">
                        <Box
                            my="auto"
                            display="flex"
                            className="section"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <BackButton className="secondary" label="Settings" />
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="space-between"
                                alignItems="center"
                                className="actions"
                            >
                                <Button color="secondary" size="large" onClick={cancelSettings}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            fontSize="1.5rem"
                            fontWeight="bold"
                            fontFamily="h1.fontFamily"
                            mt="1.5rem"
                            mb="2.5rem"
                            className="section"
                        >
                            Basic Information
                        </Box>
                        <FormikProvider value={formik}>
                            <Grid container spacing={0} alignItems="center" className="section">
                                <Grid md={3} sm={5} xs={12} item={true}>
                                    <ChangeImage />
                                </Grid>
                                <Grid md={9} sm={7} xs={12} item={true}>
                                    <Grid container spacing={0}>
                                        <Grid md={6} xs={12} item={true}>
                                            <Box px={{ sm: 0, md: 1.5 }}>
                                                <Field
                                                    field="input"
                                                    type="text"
                                                    label="First Name"
                                                    name="firstName"
                                                    {...formik.getFieldProps('firstName')}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid md={6} xs={12} item={true}>
                                            <Box px={{ sm: 0, md: 1.5 }}>
                                                <Field
                                                    field="input"
                                                    type="text"
                                                    label="Last Name"
                                                    name="lastName"
                                                    {...formik.getFieldProps('lastName')}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid xs={12} item={true}>
                                            <Box px={{ sm: 0, md: 1.5 }}>
                                                <Field
                                                    field="input"
                                                    type="text"
                                                    label="Bio"
                                                    name="bio"
                                                    multiline={true}
                                                    rows={4}
                                                    {...formik.getFieldProps('bio')}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Tag formik={formik} />
                        </FormikProvider>
                        <Box className="section border" pb={4}>
                            <Box
                                fontSize="1.5rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                                mt="2rem"
                                mb="2rem"
                            >
                                Social Networks
                            </Box>
                            <FormikProvider value={formik} className="social-form">
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box className="icon" width="40px">
                                        <Facebook fontSize="large" />
                                    </Box>
                                    <Box className="field" width="calc(100% - 40px)" pl={2}>
                                        <Field
                                            field="input"
                                            type="text"
                                            placeholder="Facebook"
                                            name="facebook"
                                            className="no-margin"
                                            {...formik.getFieldProps('facebook')}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box className="icon" width="40px">
                                        <Instagram fontSize="large" />
                                    </Box>
                                    <Box className="field" width="calc(100% - 40px)" pl={2}>
                                        <Field
                                            field="input"
                                            type="text"
                                            placeholder="Instagram"
                                            name="instagram"
                                            className="no-margin"
                                            {...formik.getFieldProps('instagram')}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box className="icon" width="40px">
                                        <Twitter fontSize="large" />
                                    </Box>
                                    <Box className="field" width="calc(100% - 40px)" pl={2}>
                                        <Field
                                            field="input"
                                            type="text"
                                            placeholder="Twitter"
                                            name="twitter"
                                            className="no-margin"
                                            {...formik.getFieldProps('twitter')}
                                        />
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box className="icon" width="40px">
                                        <Pinterest fontSize="large" />
                                    </Box>
                                    <Box className="field" width="calc(100% - 40px)" pl={2}>
                                        <Field
                                            field="input"
                                            type="text"
                                            placeholder="Pinterest"
                                            name="pinterest"
                                            className="no-margin"
                                            {...formik.getFieldProps('pinterest')}
                                        />
                                    </Box>
                                </Box>
                            </FormikProvider>
                        </Box>
                        <Box className="section border" pb={4}>
                            <Box
                                fontSize="1.5rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                                mt="2rem"
                                mb="2rem"
                            >
                                Notifications
                            </Box>
                            {NOTIF_LIST.map((item, i) => (
                                <AllowComponent item={item} key={i} formik={formik} />
                            ))}
                        </Box>
                        <Box className="section border" pb={4}>
                            <Box
                                fontSize="1.5rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                                mt="2rem"
                                mb="2rem"
                            >
                                Visibilities
                            </Box>
                            {VISIBILITY_LIST.map((item, i) => (
                                <AllowComponent item={item} key={i} formik={formik} />
                            ))}
                        </Box>
                        <Box className="section border" pb={4}>
                            <Box
                                fontSize="1.5rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                                mt="2rem"
                                mb="2rem"
                            >
                                Wallet
                            </Box>
                            <Box component="ul">
                                <Grid container spacing={1}>
                                    {myAlgoAccounts?.map((x) => (
                                        <Grid
                                            x="true"
                                            md={3}
                                            key={x?.address}
                                            className="mb-2"
                                            item={true}
                                        >
                                            <WalletCard
                                                label={x.name}
                                                key={x.address}
                                                connected={true}
                                                address={x.address}
                                                accounts={myAlgoAccounts}
                                            />
                                        </Grid>
                                    ))}
                                    <WalletCard
                                        label="Wallet Name"
                                        connected={false}
                                        accounts={myAlgoAccounts}
                                    />
                                </Grid>
                            </Box>
                        </Box>
                        <Box
                            className="section border"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            pt="2rem"
                            pb="2rem"
                        >
                            <Box
                                fontSize="1.5rem"
                                lineHeight="2rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                            >
                                <Link
                                    className="color-secondary hover-opacity"
                                    onClick={onOpenEmailDialog}
                                >
                                    Change Email
                                </Link>
                            </Box>
                            <Typography variant="body2" component="span">
                                {user?.email}
                            </Typography>
                        </Box>
                        <Box className="section" pt="2rem" pb="2rem">
                            <Box
                                fontSize="1.5rem"
                                lineHeight="2rem"
                                fontWeight="bold"
                                fontFamily="h2.fontFamily"
                            >
                                <Link
                                    className="color-secondary hover-opacity"
                                    onClick={onOpenPasswordDialog}
                                >
                                    Change Password
                                </Link>
                            </Box>
                        </Box>
                    </div>
                </form>
            </Container>
            <ChangeEmail emailDialog={emailDialog} onCloseEmailDialog={onCloseEmailDialog} />
            <ChangePassword
                passwordDialog={passwordDialog}
                onClosePasswordDialog={onClosePasswordDialog}
            />
        </>
    );
};

export default ProfileSettings;

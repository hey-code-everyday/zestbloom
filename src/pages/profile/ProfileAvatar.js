import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography } from '@material-ui/core';
import { changeImage } from 'redux/profile-settings/actions';
import { changeUserAvatar } from 'redux/auth/actions';
import { ANONYMOUS } from 'configs';

const ProfileAvatar = ({ user, username }) => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const isAuthUser = authUser?.username === username;
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState(null);

    const showSettings = isLoggedIn && isAuthUser && authUser?.role !== ANONYMOUS;
    const canUpladPhoto = showSettings;

    const openInputFile = () => {
        if (canUpladPhoto) {
            document.getElementById('selectImage').click();
        }
    };
    const handlePictureSelected = (event) => {
        const params = {
            avatar: event.target.files[0],
            username: user?.username,
        };
        dispatch(changeImage(params))
            .then((response) => {
                setAvatar(response.avatar);
                dispatch(changeUserAvatar(response.avatar));
            })
            .catch(() => {});
    };

    return (
        <>
            <Box mb={3} onClick={openInputFile} className={canUpladPhoto ? 'avatar-container' : ''}>
                <Avatar alt={user?.first_name} src={avatar ?? user?.avatar} className="xxl" />
                {canUpladPhoto && (
                    <Box
                        fontSize={20}
                        color="text.white"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        className="avatar-upload-icon"
                    >
                        <i className="icon-file-upload" style={{ fontSize: 48 }} />
                    </Box>
                )}
            </Box>
            {canUpladPhoto && (
                <input
                    id="selectImage"
                    hidden
                    type="file"
                    onChange={handlePictureSelected.bind(this)}
                />
            )}
            {user && (
                <Typography component="h1" className="profile-name font-primary">
                    {user.first_name} Collection
                </Typography>
            )}
        </>
    );
};

ProfileAvatar.propTypes = {
    user: PropTypes.object,
    username: PropTypes.string,
};

export default ProfileAvatar;

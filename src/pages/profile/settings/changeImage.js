import React, { useState } from 'react';
import { Avatar, Box, Button, Card } from '@material-ui/core';
import { CloudUploadOutlined } from '@material-ui/icons';
import { changeImage } from 'redux/profile-settings/actions';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserAvatar } from 'redux/auth/actions';

const ChangeImage = () => {
    const dispatch = useDispatch();
    let { user } = useSelector((state) => state.auth);
    const [avatar, setAvatar] = useState(user?.avatar);

    const openInputFile = () => {
        document.getElementById('selectImage').click();
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
        <Card elevation={0} align="center">
            <Box>
                <Avatar alt="Avatar" src={avatar ?? user?.avatar} className="extra" />
            </Box>
            <Box mt={2}>
                <input
                    id="selectImage"
                    hidden
                    type="file"
                    onChange={handlePictureSelected.bind(this)}
                />
                <Button
                    color="primary"
                    size="large"
                    startIcon={<CloudUploadOutlined />}
                    onClick={openInputFile}
                >
                    Change
                </Button>
            </Box>
        </Card>
    );
};

export default ChangeImage;

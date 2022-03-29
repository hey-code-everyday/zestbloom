import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import profileBanner from 'assets/img/profile-banner.png';
import { changeBanner } from '../../redux/profile/actions';
import { useParams } from 'react-router-dom';
import { ANONYMOUS } from 'configs';
import PropTypes from 'prop-types';

const Banner = ({ readOnly, banner }) => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { user: authUser } = useSelector((state) => state.auth);
    const isAuthUser = authUser?.username === username;

    const handleBanner = (event) => {
        const params = {
            banner: event.target.files[0],
            username: authUser?.username,
        };
        dispatch(changeBanner(params));
    };

    const canEdit = !readOnly && isAuthUser && authUser?.role !== ANONYMOUS;
    return (
        <div
            className="profile-banner"
            style={{ backgroundImage: `url(${banner || profileBanner}` }}
        >
            {canEdit && (
                <div className={`file-upload ${banner ? 'uploaded' : ''}`}>
                    <label>
                        <Box
                            fontSize={20}
                            color="text.white"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <input
                                type="file"
                                name="profileBanner"
                                accept="image/*"
                                onChange={handleBanner.bind(this)}
                            />
                            <i className="icon-file-upload" style={{ fontSize: 48 }} />
                            <Box mt={2} display={{ xs: 'none', sm: 'block' }}>
                                {banner ? 'Change banner image' : 'Upload banner image'}
                            </Box>
                        </Box>
                    </label>
                </div>
            )}
        </div>
    );
};

Banner.propTypes = {
    readOnly: PropTypes.bool,
    banner: PropTypes.string,
};

export default Banner;

import React from 'react';
import Banner from '../Banner';
import { Box, Container } from '@material-ui/core';
import ProfileTopMobile from '../ProfileTopMobile';
import Sidebar from '../Sidebar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ActivityTabs from './ActivityTabs';

const ProfileActivity = () => {
    const { username } = useParams();
    const state = useSelector((state) => state);
    const profileInfo = username ? 'profile' : 'auth';
    const user = state[profileInfo].user;
    return (
        <>
            <Banner readOnly />
            <Container maxWidth="xl">
                <Box display={{ xs: 'block', md: 'none' }}>
                    <ProfileTopMobile username={username} user={user} />
                </Box>
                <div className="profile-content">
                    <Sidebar username={username} user={user} />
                    <ActivityTabs username={username} />
                </div>
            </Container>
        </>
    );
};

export default ProfileActivity;

import React, { useEffect } from 'react';
import { getFollowingUsers, loadMoreFollowingUsers } from 'redux/followers/actions';
import { useDispatch, useSelector } from 'react-redux';
import PeopleCard from '../../components/elements/cards/peopleCardFollowers';
import { Box, Button, Grid } from '@material-ui/core';
import LottieContainer from 'components/shared/LottieContainer';
import axios from 'axios';
const ProfileFollowing = () => {
    const dispatch = useDispatch();
    const { followingUsers, loadMoreFollowingUsersURL, getFollowingLoading } = useSelector(
        (state) => state.followers,
    );

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();

        dispatch(getFollowingUsers(currentRequest));

        return () => currentRequest?.cancel();
    }, [dispatch]);

    const loadMore = () => {
        dispatch(loadMoreFollowingUsers(loadMoreFollowingUsersURL));
    };

    return (
        <div>
            <Grid
                container
                spacing={3}
                justifyContent={followingUsers?.length === 0 ? 'center' : 'flex-start'}
            >
                {getFollowingLoading && followingUsers?.length === 0 && (
                    <LottieContainer
                        containerStyles={{
                            height: '49px',
                            width: '100%',
                            marginTop: '40px',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                )}
                {followingUsers?.length === 0 && !getFollowingLoading && <div>No Users</div>}
                {followingUsers.map((item) => (
                    <Grid item lg={4} md={4} sm={6} xs={6} key={item.username}>
                        <PeopleCard
                            key={item?.username}
                            tags={item?.selected_tags}
                            img={item?.banner}
                            author={item?.username}
                            firstName={item?.first_name}
                            lastName={item?.last_name}
                            authorAvatar={item?.avatar}
                            authorName={item?.authorName}
                            bio={item?.bio}
                        />
                    </Grid>
                ))}
            </Grid>

            {loadMoreFollowingUsersURL && (
                <Box textAlign="center" mt={5}>
                    <Button variant="outlined" color="secondary" size="large" onClick={loadMore}>
                        Load More
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default ProfileFollowing;

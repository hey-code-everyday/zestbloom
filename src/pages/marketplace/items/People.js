import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import PeopleCard from 'components/elements/cards/peopleCard';
import { getFilteredPeopleElements } from '../util';
import { getUsers } from 'redux/marketplace/actions';
import { followUser, unFollowUser } from 'redux/profile/actions';
import { useDispatch, useSelector } from 'react-redux';
import LottieContainer from 'components/shared/LottieContainer';
import LoadMoreBtn from 'components/shared/LoadMoreBtn';
import axios from 'axios';
import { useDebounce } from 'react-use';
import PropTypes from 'prop-types';

const People = ({
    sortPeople,
    filterPeopleByTag,
    searchValue,
    sortPeopleByRole,
    filterPeople,
    displayVisibility,
    loadMoreUsers,
}) => {
    const dispatch = useDispatch();
    const { users, getUsersLoading, loadMoreUsersURL, loadMoreLoading } = useSelector(
        (state) => state.marketplace,
    );
    const [filterPath, setFilterPath] = useState(null);

    const getPeopleFilter = useCallback(() => {
        const filter = getFilteredPeopleElements(
            sortPeople,
            filterPeopleByTag,
            searchValue,
            sortPeopleByRole,
            filterPeople,
        );
        setFilterPath(filter);
    }, [filterPeopleByTag, sortPeople, searchValue, sortPeopleByRole, filterPeople]);

    const getPeople = useCallback(
        (currentRequest) => {
            if (filterPath) dispatch(getUsers(filterPath, currentRequest));
        },
        [filterPath, dispatch],
    );

    useDebounce(
        () => {
            getPeopleFilter();
        },
        500,
        [getPeopleFilter],
    );

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        getPeople(currentRequest);
        return () => currentRequest?.cancel();
    }, [getPeople]);

    const handleFollow = (user, setInAction) => {
        if (user?.follow) {
            dispatch(unFollowUser(user.username)).then(() => setInAction(false));
        } else {
            dispatch(followUser(user.username)).then(() => setInAction(false));
        }
    };

    if (!displayVisibility) {
        return null;
    }

    return (
        <>
            <Grid container spacing={3} className="list-with-link">
                <Grid item xs={12}>
                    <Typography
                        variant="h3"
                        className="text-capitalize mt-5 marketplace-section-title"
                    >
                        All People
                    </Typography>
                </Grid>
                {getUsersLoading && users?.length === 0 && (
                    <LottieContainer
                        containerStyles={{
                            height: '49px',
                            width: '100%',
                            marginTop: '40px',
                        }}
                        lottieStyles={{ width: '49px' }}
                    />
                )}
                {users?.length === 0 && !getUsersLoading && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        No Users
                    </div>
                )}

                {users?.map((user) => (
                    <Grid item lg={4} md={4} sm={6} xs={12} key={user?.username}>
                        <PeopleCard key={user.username} user={user} handleFollow={handleFollow} />
                    </Grid>
                ))}
            </Grid>

            {loadMoreUsersURL &&
                (loadMoreLoading ? (
                    <LottieContainer
                        containerStyles={{
                            height: '49px',
                            width: '100%',
                            marginTop: '40px',
                        }}
                        lottieStyles={{ width: '49px' }}
                    />
                ) : (
                    <LoadMoreBtn loadMoreAssets={() => loadMoreUsers(loadMoreUsersURL)} />
                ))}
        </>
    );
};

People.propTypes = {
    sortPeople: PropTypes.string,
    filterPeopleByTag: PropTypes.array,
    searchValue: PropTypes.string,
    sortPeopleByRole: PropTypes.string,
    filterPeople: PropTypes.string,
    displayVisibility: PropTypes.bool,
    loadMoreUsers: PropTypes.func,
};

export default People;

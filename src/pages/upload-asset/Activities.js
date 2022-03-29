import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

import LottieContainer from 'components/shared/LottieContainer';
import { loadMoreActivities } from 'redux/singleAsset/actions';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Activities = ({ activities }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const { loadMoreActivitiesURL } = useSelector((state) => state.singleAsset);

    const onScroll = useCallback(
        (e) => {
            const container = containerRef.current;
            const scrollHeight = container.scrollHeight;
            const scrolledHeight = container.clientHeight + container.scrollTop;
            const isBottom = scrollHeight === scrolledHeight;
            if (isBottom && !loading && loadMoreActivitiesURL) {
                setLoading(true);
                dispatch(loadMoreActivities(loadMoreActivitiesURL)).then((res) => {
                    setLoading(false);
                });
            }
        },
        [containerRef, loadMoreActivitiesURL, dispatch, loading],
    );

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', onScroll);
        return () => {
            container.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    return (
        <Box className="modal-body">
            <Box
                style={{ padding: '0 20px' }}
                className="asset-activity-container"
                ref={containerRef}
            >
                <Box component="ul" className="asset-activity-container-list">
                    {activities?.map((activity) => {
                        return (
                            <Box component="li" key={activity?.guid}>
                                <Box className="image">
                                    <Avatar
                                        alt={activity?.sender?.username}
                                        src={
                                            !!activity?.sender?.avatar
                                                ? activity?.sender?.avatar
                                                : './'
                                        }
                                        style={{ display: 'flex' }}
                                    />
                                </Box>
                                <Box className="info">
                                    <Box className="title" style={{ marginTop: '5px' }}>
                                        <Box
                                            fontWeight="bold"
                                            fontFamily="h1.fontFamily"
                                            className="link primary"
                                            component={Link}
                                            to={`/profile/${activity?.sender?.username}`}
                                        >
                                            @{activity?.sender?.username}
                                        </Box>{' '}
                                        {activity?.description}
                                    </Box>
                                    <Box className="time">{activity?.timesince} ago</Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                {loading && (
                    <LottieContainer
                        containerStyles={{
                            height: '50px',
                            width: '153px',
                            margin: '10px auto',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                )}
            </Box>
        </Box>
    );
};

Activities.propTypes = {
    activities: PropTypes.array,
};

export default Activities;

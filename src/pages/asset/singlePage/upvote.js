import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { ThumbUpOutlined, ThumbUp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { upVoteCurrentAsset, unUpVoteCurrentAsset } from 'redux/singleAsset/actions';
import { ANONYMOUS } from 'configs';
import PropTypes from 'prop-types';

const Upvote = ({ currentAsset, canFollowAndVoted }) => {
    const dispatch = useDispatch();
    const [disableVoted, setDisableVoted] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const upvote = (guid) => {
        if (canFollowAndVoted && !disableVoted && user?.role !== ANONYMOUS) {
            setDisableVoted(true);
            dispatch(upVoteCurrentAsset(guid)).then((res) => {
                setDisableVoted(false);
            });
        }
    };

    const unUpvote = (guid) => {
        if (canFollowAndVoted && !disableVoted && user?.role !== ANONYMOUS) {
            setDisableVoted(true);
            dispatch(unUpVoteCurrentAsset(guid)).then((res) => {
                setDisableVoted(false);
            });
        }
    };

    return (
        <Box className="upvote" fontSize={16} display="flex" alignItems="center" mr={4}>
            {currentAsset?.voted ? (
                <Box className="color-primary">
                    <ThumbUp
                        style={{ fontSize: 24 }}
                        className="pointer hover-opacity"
                        onClick={() => unUpvote(currentAsset?.guid)}
                    />
                </Box>
            ) : (
                <Box className="color-grey">
                    <ThumbUpOutlined
                        style={{ fontSize: 24 }}
                        className="pointer hover-opacity"
                        onClick={() => upvote(currentAsset?.guid)}
                    />
                </Box>
            )}
            <Box className="vote-count" component="span" ml={1}>
                {currentAsset?.vote_count}
            </Box>
        </Box>
    );
};

Upvote.propTypes = {
    currentAsset: PropTypes.object,
    canFollowAndVoted: PropTypes.bool,
};

export default Upvote;

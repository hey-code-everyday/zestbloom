import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toFavoriteCurrentAsset, removeFromFavoritesCurrentAsset } from 'redux/singleAsset/actions';
import { FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { Star, StarBorder } from '@material-ui/icons';
import PropTypes from 'prop-types';

const ToFavorite = ({ currentAsset, canFollowAndVoted }) => {
    const dispatch = useDispatch();
    const [disableFollowing, setDisableFollowing] = useState(false);

    const toFavorites = (guid) => {
        if (canFollowAndVoted && !disableFollowing) {
            setDisableFollowing(true);
            dispatch(toFavoriteCurrentAsset(guid)).then((res) => {
                setDisableFollowing(false);
            });
        }
    };

    const removeFromFavorites = (guid) => {
        if (canFollowAndVoted && !disableFollowing) {
            setDisableFollowing(true);
            dispatch(removeFromFavoritesCurrentAsset(guid)).then((res) => {
                setDisableFollowing(false);
            });
        }
    };

    const handleChangeFavorites = (guid) => {
        if (currentAsset?.favorite) {
            removeFromFavorites(guid);
        } else {
            toFavorites(guid);
        }
    };
    return (
        <Box className="favorite" fontSize={16} display="flex" alignItems="center" mr={4}>
            <FormControlLabel
                className="hover-opacity"
                control={
                    <Checkbox
                        disableRipple
                        checked={currentAsset?.favorite}
                        onChange={() => handleChangeFavorites(currentAsset?.guid)}
                        className="fav-icon"
                        icon={<StarBorder style={{ fontSize: 24 }} />}
                        checkedIcon={<Star style={{ fontSize: 24 }} color="primary" />}
                    />
                }
                style={{ marginRight: '0' }}
            />
            <Box className="favorite-count" component="span" ml={1}>
                {currentAsset?.favorite_count}
            </Box>
        </Box>
    );
};

ToFavorite.propTypes = {
    currentAsset: PropTypes.object,
    canFollowAndVoted: PropTypes.bool,
};

export default ToFavorite;

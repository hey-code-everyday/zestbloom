import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, Card, CardContent, Box } from '@material-ui/core';
import AssetCardImage from 'components/elements/cards/assetCardImage';
import PropTypes from 'prop-types';

const ProfileContractsMain = ({ items = [] }) => {
    const { username, tab } = useParams();

    const hasVisibleItem = !!items.find((i) => i.visible);

    return (
        <>
            {hasVisibleItem ? (
                items.map(({ id, label, image, visible, content_type, content_url, thumbnail }) =>
                    visible ? (
                        <Grid key={id} item className="profile-contracts-item" md={6}>
                            <Link
                                to={`/profile/${username}/${tab}/${id}`}
                                className="relative w-100 h-100"
                            >
                                <Card>
                                    <Box className="profile-contracts-bg-img">
                                        <AssetCardImage
                                            content_type={content_type}
                                            img={content_url}
                                            thumbnail={thumbnail}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Box className="label">{label}</Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ) : null,
                )
            ) : (
                <div className="w-100 mt-5 text-center">
                    No contracts are available at the moment.
                </div>
            )}
        </>
    );
};

ProfileContractsMain.propTypes = {
    item: PropTypes.array,
};

export default ProfileContractsMain;

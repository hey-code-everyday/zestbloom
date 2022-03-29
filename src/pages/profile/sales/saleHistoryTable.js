import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
} from '@material-ui/core';
import { timeSince } from 'helpers/intervalYears';
import LottieContainer from 'components/shared/LottieContainer';

import algoFont from 'assets/img/algo-font.svg';
import PropTypes from 'prop-types';

const LoadImage = React.lazy(() => import('components/elements/cards/assetCardImage'));

const Loading = () => {
    return (
        <div className="card-lottie">
            <LottieContainer
                containerStyles={{
                    height: '50px',
                    width: '153px',
                }}
                lottieStyles={{ width: '50px' }}
            />
        </div>
    );
};

const SaleHistoryTable = ({ items }) => {
    const rows = items.map((item) => {
        const { asset, type, amount = 0, closed_at, purchaser } = item;
        const { url, ipfs_url, mimetype } = asset?.content ?? {};
        const image = url ?? ipfs_url;
        const thumbnail = asset?.thumbnail?.url;
        return {
            image,
            assetId: asset.asset_id,
            title: asset.title,
            mimetype,
            thumbnail,
            purchaser: (
                <Box display="flex">
                    purchased by&nbsp;
                    <Link to={`/profile/${purchaser.username}`} className="link primary ellipsis">
                        @{purchaser.username}
                    </Link>
                </Box>
            ),
            amount: amount / 1000000,
            type: `by ${type}`,
            timeAgo: `${timeSince(closed_at)} ago`,
        };
    });

    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {rows.map(
                        (
                            {
                                image,
                                assetId,
                                title,
                                purchaser,
                                mimetype,
                                amount,
                                type,
                                timeAgo,
                                thumbnail,
                            },
                            i,
                        ) => (
                            <TableRow key={`${assetId}${i}`}>
                                <TableCell>
                                    <Suspense fallback={<Loading />}>
                                        <div className="sale-history-img">
                                            <LoadImage
                                                content_type={mimetype}
                                                img={image}
                                                thumbnail={thumbnail}
                                            />
                                        </div>
                                    </Suspense>
                                </TableCell>

                                <TableCell align="left">
                                    <Box display="flex">
                                        <Link
                                            to={`/asset/${assetId}`}
                                            className="link primary ellipsis"
                                        >
                                            {assetId}
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell align="left">{title}</TableCell>
                                <TableCell align="left">{purchaser}</TableCell>
                                <TableCell align="left">
                                    <Grid
                                        container
                                        alignItems="center"
                                        justifyContent="flex-start"
                                        spacing={1}
                                    >
                                        <Grid item>
                                            <img src={algoFont} alt="Algo" width={12} height={12} />
                                        </Grid>
                                        <Grid item>
                                            <span>{amount}</span>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell align="left">{type}</TableCell>
                                <TableCell align="right">{timeAgo}</TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

SaleHistoryTable.propTypes = {
    items: PropTypes.array,
};

export default SaleHistoryTable;

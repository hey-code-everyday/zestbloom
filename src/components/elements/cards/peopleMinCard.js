import React, { useMemo } from 'react';
import { Avatar, Box } from '@material-ui/core';
import { useHistory } from 'react-router';
import { PRIVATE } from 'configs';
import MakeAnOffer from '../../../pages/asset/singlePage/actionsWithAsset/makeAnOffer';
import BuyNow from '../../../pages/asset/singlePage/actionsWithAsset/buyNow';
import Auction from '../../../pages/asset/singlePage/actionsWithAsset/auction';
import { useSelector } from 'react-redux';
import Currency from 'react-currency-formatter';
import { useAlgoFont } from 'hooks/assets';
import PropTypes from 'prop-types';

const PeopleMinCard = ({
    author,
    authorAvatar,
    tags,
    node,
    sale_amount,
    currentAsset,
    giveNotification,
}) => {
    const history = useHistory();
    const { isLoggedIn, user: authUser } = useSelector((state) => state.auth);
    const auction = node?.auctions?.find((x) => x.status === 'STARTED');
    const bestSale = node?.sales?.find(
        (contract) => contract.type === 'SaleByEscrow' && contract.status === 'ACTIVE',
    );
    const AlgoFont = useAlgoFont();

    const offerContract =
        node?.offers?.filter((offer) => offer.maker?.username === authUser?.username) ?? [];

    const amount = useMemo(() => {
        if (auction) return auction?.last_bid?.bid_amount ?? '0';
        return node ? (node.price && bestSale ? node.price : '') : null;
    }, [node, auction, bestSale]);

    const showIcon = amount !== '';

    const isPrivate = author === PRIVATE;

    const onSubmit = (event) => {
        if (!isPrivate) return history.push(`/profile/${author}`);
    };

    return (
        <Box className="people-min-card" display="flex" alignItems="center">
            <div
                className="min-avatar circle"
                onClick={onSubmit}
                onMouseOver={(e) => {
                    e.target.style.cursor = 'pointer';
                }}
            >
                <Avatar
                    alt={author}
                    src={!!authorAvatar ? authorAvatar : './'}
                    className={isPrivate ? 'private_user_icon' : ''}
                />
            </div>
            <Box display="flex" flexDirection="column" justifyContent="space-between">
                <Box
                    onClick={onSubmit}
                    onMouseOver={(e) => {
                        e.target.style.cursor = 'pointer';
                    }}
                >
                    {author && (
                        <Box
                            fontSize="1rem"
                            fontWeight="bold"
                            fontFamily="h1.fontFamily"
                            className={`${!isPrivate && 'link'} primary author-name`}
                        >
                            {isPrivate ? author : `@${author}`}
                        </Box>
                    )}
                </Box>
                {/* {!node && tags?.find((tag) => tag.type === 'static') && (
                    <Box
                        className="tag-body"
                        onClick={onSubmit}
                        onMouseOver={(e) => {
                            e.target.style.cursor = 'pointer';
                        }}
                    >
                        <Tag
                            text={tags?.find((tag) => tag.type === 'static')?.name}
                            className="secondary sm top-right"
                        />
                    </Box>
                )} */}
                {/* {!node && tags?.find((tag) => tag.type === 'custom') && (
                    <Box
                        className="tag-body"
                        onClick={onSubmit}
                        onMouseOver={(e) => {
                            e.target.style.cursor = 'pointer';
                        }}
                    >
                        <Tag
                            text={tags?.find((tag) => tag.type === 'custom')?.name}
                            className="secondary sm top-right"
                        />
                    </Box>
                )} */}
                {sale_amount && (
                    <Box className="amount-body" style={{ marginTop: '5px' }}>
                        <Box className="price-algo">
                            <Box component="span" className="bid-price">
                                <Currency quantity={sale_amount} currency="USD" />
                            </Box>
                        </Box>
                    </Box>
                )}
                {amount && (
                    <Box className="amount-body">
                        <Box className="price-algo">
                            <Box component="span" className="bid-price">
                                {amount}
                            </Box>
                            {showIcon && <img src={AlgoFont} alt="Algo" />}
                        </Box>
                    </Box>
                )}
                {!auction && (
                    <MakeAnOffer
                        currentAsset={currentAsset}
                        hasOffer={offerContract}
                        isLoggedIn={isLoggedIn}
                        oneNode={node}
                        showModal={true}
                    />
                )}
                {amount && !auction && (
                    <BuyNow
                        currentAsset={currentAsset}
                        giveNotification={giveNotification}
                        bestSale={bestSale}
                        oneNode={node}
                    />
                )}
                {auction && (
                    <Auction
                        auction={auction}
                        node={node}
                        currentAsset={currentAsset}
                        mini={true}
                    />
                )}
            </Box>
        </Box>
    );
};

PeopleMinCard.propTypes = {
    author: PropTypes.string,
    authorAvatar: PropTypes.string,
    tags: PropTypes.array,
    node: PropTypes.object,
    sale_amount: PropTypes.number,
    currentAsset: PropTypes.object,
    giveNotification: PropTypes.func,
};

export default PeopleMinCard;

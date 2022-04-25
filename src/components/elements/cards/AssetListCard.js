import React, { Suspense } from 'react';
import { Typography } from '@material-ui/core';
import StarIcon from '../../icons/StarIcon';
import LottieContainer from '../../shared/LottieContainer';
import { Link } from 'react-router-dom';

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
const LoadImage = React.lazy(() => import('./assetCardImage'));

const AssetListCard = ({ item }) => {
    const { url: image_url, ipfs_url, mimetype } = item?.asset?.content ?? {};
    const img = image_url ?? ipfs_url;
    const content_type = mimetype;
    const thumbnail = item?.asset?.thumbnail?.url;
    const assetId = item?.asset?.asset_id;
    console.log(item);
    return (
        <Link to={`/asset/${assetId}`} className="collection-list-card">
            {/*<img*/}
            {/*    src={bannerImg2}*/}
            {/*    height={120}*/}
            {/*    width={262}*/}
            {/*    style={{ objectFit: 'cover' }}*/}
            {/*    // style="display: block;height: 35px;width: 186px;"*/}
            {/*    alt="Logo"*/}
            {/*/>*/}
            <div className="img-container">
                <Suspense fallback={<Loading />}>
                    <LoadImage content_type={content_type} img={img} thumbnail={thumbnail} />
                </Suspense>
            </div>
            <div className="list-card-content">
                <div className="title-box">
                    <Typography className="title">{item?.asset?.title || '--'}</Typography>
                </div>
                <Typography className="description">
                    {item?.description.substring(0, 80).concat('...') || '--'}
                </Typography>
                <div className="rank">
                    <StarIcon />
                    <Typography style={{ marginInlineStart: 8 }}>
                        {item?.favorite_count || '0'}
                    </Typography>
                </div>
                <div className="price">
                    <Typography color="textSecondary">Price</Typography>
                    <Typography fontSize="18px" style={{ marginTop: 8 }}>
                        --
                    </Typography>
                </div>
            </div>
        </Link>
    );
};
export default AssetListCard;

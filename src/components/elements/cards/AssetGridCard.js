import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import LottieContainer from '../../shared/LottieContainer';
import 'assets/styles/pages/_cards.scss';

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

const AssetGridCard = ({ item }) => {
    const { url: image_url, ipfs_url, mimetype } = item?.asset?.content ?? {};
    const img = image_url ?? ipfs_url;
    const content_type = mimetype;
    const thumbnail = item?.asset?.thumbnail?.url;
    const assetId = item?.asset?.asset_id;
    return (
        <Link to={`/asset/${assetId}`} className="collection-grid-card">
            {/*<img*/}
            {/*    src={bannerImg2}*/}
            {/*    height={306}*/}
            {/*    width={316}*/}
            {/*    style={{ objectFit: 'cover' }}*/}
            {/*    // style="display: block;height: 35px;width: 186px;"*/}
            {/*    alt="Logo"*/}
            {/*/>*/}
            <div className="img-container">
                <Suspense fallback={<Loading />}>
                    <LoadImage content_type={content_type} img={img} thumbnail={thumbnail} />
                </Suspense>
            </div>
            <div className="body">
                <div className="name">
                    {/*<Typography color="textSecondary">Name</Typography>*/}
                    <Typography noWrap fontSize="18px" style={{ maxWidth: 200 }}>
                        {item?.asset?.title || '--'}
                    </Typography>
                </div>
                <div className="price">
                    {/*<Typography color="textSecondary">Price</Typography>*/}
                    <Typography fontSize="18px">--</Typography>
                </div>
            </div>
        </Link>
    );
};
export default AssetGridCard;

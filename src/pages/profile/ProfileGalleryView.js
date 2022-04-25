import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import {
    afterMakeAnOffer,
    buyNowSuccess,
    changeCollectedAssetVisibility,
    placeABidAction,
    removeFromFavoritesCollectedAssets,
    toFavoritesCollectedAssets,
    unUpvoteCollectedAsset,
    upvoteCollectedAsset,
} from '../../redux/collectedAssets/actions';
import AssetCard from '../../components/elements/cards/assetCard';

const ProfileGalleryView = ({ items, isMyProfile, assetsInWallet }) => {
    return (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3, 1200: 4 }}>
            <Masonry gutter="10px" style={{ margin: '32px auto' }}>
                {items.map((item, index) => (
                    <AssetCard
                        key={item?.guid + index}
                        item={item}
                        upvoteAsset={upvoteCollectedAsset}
                        unUpvoteAsset={unUpvoteCollectedAsset}
                        toFavoritesAssets={toFavoritesCollectedAssets}
                        removeFromFavoritesAssets={removeFromFavoritesCollectedAssets}
                        changeAssetVisibility={changeCollectedAssetVisibility}
                        isLoggedIn={true}
                        assetsInWallet={assetsInWallet}
                        updateAsset={placeABidAction}
                        buyNowSuccess={buyNowSuccess}
                        collected={true}
                        afterMakeAnOffer={afterMakeAnOffer}
                        selectable
                        isMyProfile={isMyProfile}
                        galleryMode
                    />
                ))}
            </Masonry>
        </ResponsiveMasonry>
    );
};
export default ProfileGalleryView;

import { useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AssetTagFilter = ({ dashboardPage }) => {
    const history = useHistory();
    const { search } = useLocation();
    const { username } = useParams();
    const params = new URLSearchParams(search);
    const assetTagsParam = params.get('assetTags') ? params.get('assetTags').split(',') : [];

    const { assetsTags } = useSelector((state) => state.marketplace);

    const handleSelectAssetTag = (selectedTags) => {
        if (selectedTags.length > 0) {
            if (dashboardPage) {
                history.push(`/profile/${username}?assetTags=${selectedTags.join(',')}`);
            } else {
                history.push(`/marketplace?assetTags=${selectedTags.join(',')}`);
            }
        } else {
            if (dashboardPage) {
                history.push(`/profile/${username}`);
            } else {
                history.push('/marketplace');
            }
        }
    };

    const handleTagClick = (clickedTag) => {
        if (clickedTag === 'ALL') {
            handleSelectAssetTag(assetsTags.map((a) => a.slug));
        } else if (assetTagsParam.includes(clickedTag)) {
            handleSelectAssetTag(assetTagsParam.filter((a) => a !== clickedTag));
        } else {
            handleSelectAssetTag([...assetTagsParam, clickedTag]);
        }
    };

    return (
        <>
            <button
                className={`whiteBtnHoverGreen ${
                    assetTagsParam.length === assetsTags.length ? 'whiteBtnHoverGreen-selected' : ''
                }`}
                onClick={() => handleTagClick('ALL')}
            >
                <span className="text">All</span>
            </button>
            {assetsTags?.map((item) => (
                <button
                    key={item.slug}
                    className={`whiteBtnHoverGreen ${
                        !!assetTagsParam.find((x) => x === item.slug)
                            ? 'whiteBtnHoverGreen-selected'
                            : ''
                    } ${item.category === 'custom' ? 'new-label' : ''}`}
                    onClick={() => handleTagClick(item.slug)}
                >
                    {item.icon && <i className={item.icon} />}
                    {item.name && <span className="text">{item.name}</span>}
                </button>
            ))}
        </>
    );
};

AssetTagFilter.propTypes = {
    dashboardPage: PropTypes.bool,
};

export default AssetTagFilter;

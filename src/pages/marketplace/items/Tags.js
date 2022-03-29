import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonTag from 'components/shared/ButtonTag';
import { getPeopleTags } from 'redux/marketplace/actions';
import PropTypes from 'prop-types';

const Tags = ({ filterByTag, setFilterByTag, viewType }) => {
    const { assetsStaticTags, peopleTags } = useSelector((state) => state.marketplace);
    const dispatch = useDispatch();

    useEffect(() => {
        if (viewType === 'people' && peopleTags?.length === 0) {
            dispatch(getPeopleTags());
        }
    }, [dispatch, viewType, peopleTags]);

    const staticTags = viewType === 'people' ? peopleTags : assetsStaticTags;
    return (
        <>
            {staticTags?.map((item) => (
                <ButtonTag
                    key={item.slug}
                    text={item.name}
                    selected={filterByTag.includes(item.slug)}
                    slug={item.slug}
                    icon={item.icon}
                    setFilterByTag={setFilterByTag}
                    category={item.category}
                />
            ))}
            <ButtonTag
                key="custom"
                text="Custom"
                selected={filterByTag.includes('custom')}
                slug="custom"
                icon="icon-label"
                setFilterByTag={setFilterByTag}
                category="custom"
            />
        </>
    );
};

Tags.propTypes = {
    filterByTag: PropTypes.array,
    setFilterByTag: PropTypes.func,
    viewType: PropTypes.string,
};

export default Tags;

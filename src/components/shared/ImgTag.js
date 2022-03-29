import React from 'react';
import { Tag } from 'components/shared';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const ImgTag = ({ src, alt, tag, className, asset_id }) => {
    return (
        <div className={`img-tag ${className}`}>
            <NavLink to={asset_id ? `/asset/${asset_id}` : '/'} className="img-tag-link">
                {tag && <Tag text={tag} className="secondary sm top-left rotated" />}
                <img src={src} alt={alt} />
            </NavLink>
        </div>
    );
};

ImgTag.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    tag: PropTypes.string,
    className: PropTypes.string,
    asset_id: PropTypes.number,
};

export default ImgTag;

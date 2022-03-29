import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

import AssetTypeVR from 'assets/img/zb-new/type-vr.svg';
import AssetTypeAuditoBooks from 'assets/img/zb-new/type-audio-book.svg';
import AssetTypeArt from 'assets/img/zb-new/type-art.svg';
import AssetTypeFilm from 'assets/img/zb-new/type-film.svg';
import AssetTypeMusic from 'assets/img/zb-new/type-music.svg';
import AssetTypeLiterature from 'assets/img/zb-new/type-literature.svg';

const tagIcons = {
    'virtual-reality': AssetTypeVR,
    'audio-books': AssetTypeAuditoBooks,
    art: AssetTypeArt,
    film: AssetTypeFilm,
    music: AssetTypeMusic,
    literature: AssetTypeLiterature,
};

const CardTags = ({ tags }) => {
    if (tags.length === 0) return null;

    return (
        <Box className="card-tags">
            {tags.map((tag) => (
                <Box key={tag.slug} className={`card-tags-tag bg-${tag.color}`}>
                    <img src={tagIcons[tag.icon]} alt={tag.icon} />
                </Box>
            ))}
        </Box>
    );
};

CardTags.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string.isRequired,
            color: PropTypes.oneOf(['orange', 'yellow', 'red', 'green', 'gray', 'blue']),
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
        }),
    ),
};

export default CardTags;

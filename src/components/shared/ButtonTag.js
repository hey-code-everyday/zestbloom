import React from 'react';
import { selectTag } from '../../redux/profile-settings/actions';
import { changeTags } from 'redux/auth/actions';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';

const ButtonTag = ({
    text,
    icon,
    selected,
    slug,
    setFilterByTag,
    onSelectTagFromUpload,
    category,
    setAbortRequest,
    abortRequest,
}) => {
    const dispatch = useDispatch();

    const selectTags = (event) => {
        if (setFilterByTag) {
            return setFilterByTag((prev) =>
                prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug],
            );
        }
        const data = { selected: !selected };

        abortRequest?.cancel();

        const currentRequest = axios.CancelToken.source();
        setAbortRequest(currentRequest);
        dispatch(selectTag(data, slug, currentRequest)).then((response) => {
            if (response?.status === 200) {
                dispatch(changeTags(response.data));
            }
        });
    };

    return (
        <button
            className={`whiteBtnHoverGreen ${selected ? 'selected' : ''} ${
                category === 'custom' ? 'new-label' : ''
            }`}
            onClick={(e) =>
                onSelectTagFromUpload ? onSelectTagFromUpload({ slug, category }) : selectTags(e)
            }
        >
            {icon && <i className={icon} />}
            {text && <span className="text">{text}</span>}
        </button>
    );
};

ButtonTag.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    slug: PropTypes.string,
    setFilterByTag: PropTypes.func,
    onSelectTagFromUpload: PropTypes.func,
    category: PropTypes.string,
    setAbortRequest: PropTypes.func,
    abortRequest: PropTypes.object,
};

export default ButtonTag;

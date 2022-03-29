import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const ShowMoreText = ({ text, max = 100 }) => {
    const [showLess, setShowLess] = useState(true);
    if (text?.length <= max) {
        return <Typography style={{ whiteSpace: 'pre-line' }}> {text}</Typography>;
    }

    const show = () => {
        setShowLess(!showLess);
    };

    return (
        <>
            <Typography style={{ lineHeight: '1.5rem', whiteSpace: 'pre-line' }}>
                {showLess ? `${text?.substring(0, max)} ...` : text}{' '}
                <button
                    onClick={show}
                    style={{ color: '#485AFD', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    {showLess ? ' Show More' : ' Show Less'}
                </button>
            </Typography>
        </>
    );
};

ShowMoreText.propTypes = {
    text: PropTypes.string,
    max: PropTypes.number,
};

export default ShowMoreText;

import React from 'react';
import lottie_img from 'assets/img/lottie.gif';
import PropTypes from 'prop-types';

const LottieContainer = ({ containerStyles, lottieStyles }) => {
    return (
        <div
            style={{
                ...containerStyles,
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <img src={lottie_img} alt="lottie" style={lottieStyles} />
        </div>
    );
};

LottieContainer.propTypes = {
    containerStyles: PropTypes.object,
    lottieStyles: PropTypes.object,
};

export default LottieContainer;

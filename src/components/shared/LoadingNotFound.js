import React from 'react';
import NotFound from './notFound';
import LottieContainer from './LottieContainer';

import PropTypes from 'prop-types';

const LoadingNotFound = ({ loading }) => {
    return (
        <>
            {loading ? (
                <div style={{ height: '500px' }} className="not-found-in-pages">
                    <LottieContainer
                        containerStyles={{
                            height: '90px',
                            width: '100%',
                        }}
                        lottieStyles={{ width: '95px' }}
                    />
                </div>
            ) : (
                <NotFound fromPage={true} />
            )}
        </>
    );
};

LoadingNotFound.propTypes = {
    loading: PropTypes.bool,
};

export default LoadingNotFound;

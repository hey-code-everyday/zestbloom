import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Box } from '@material-ui/core';

import loadingImg from 'assets/img/zb-new/loading.gif';

const PageLoading = ({ loading }) => {
    const [hideComponent, setHideComponent] = useState(false);
    const { isDarkMode } = useSelector((state) => state.profile);
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setHideComponent(true);
            }, 400);
        } else {
            setHideComponent(false);
        }
    }, [loading]);
    return (
        <Box
            position="fixed"
            tpp={0}
            left={0}
            width="100vw"
            height="100vh"
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={clsx(
                !loading && 'animation-zoom-in-hide',
                hideComponent && 'display-none',
                isDarkMode && 'bg-dark-mode',
            )}
        >
            <img src={loadingImg} alt="loading" width={300} height={300} />
        </Box>
    );
};

PageLoading.propTypes = {
    loading: PropTypes.bool.isRequired,
};

export default PageLoading;

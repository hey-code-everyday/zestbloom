import React from 'react';
import { Header } from 'components/elements';
import { Box, Button } from '@material-ui/core';
import notFoundIcon from 'assets/img/not-found-404.png';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

const NotFound = ({ fromPage }) => {
    const history = useHistory();

    const goBack = () => history.goBack();

    return (
        <>
            {!fromPage && <Header hasSearch={false} />}
            <div className="not-found-container">
                <Box className="content">
                    <Box className="content-icon">
                        <img src={notFoundIcon} alt="not-found" />
                        <Box className="message-header">Oops....</Box>
                        <Box className="message">Look's like Grizzly is lost again.</Box>
                        <Box className="go-back-btn">
                            <Button
                                variant="contained"
                                color="primary"
                                className="sidebar-menu-follow"
                                size="large"
                                onClick={goBack}
                                fullWidth
                            >
                                Go Back
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </div>
        </>
    );
};

NotFound.propTypes = {
    fromPage: PropTypes.bool,
};

export default NotFound;

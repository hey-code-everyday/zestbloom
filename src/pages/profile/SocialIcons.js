import React from 'react';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const SocialIcons = ({ user }) => {
    const withHttps = (url) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url);

    const SOCIAL_MENU = [
        {
            icon: <i className="icon-twitter display-block" />,
            url: user?.social_twitter ? withHttps(user?.social_twitter) : null,
        },
        {
            icon: <i className="icon-facebook display-block" />,
            url: user?.social_facebook ? withHttps(user?.social_facebook) : null,
        },
        {
            icon: <i className="icon-instagram display-block" />,
            url: user?.social_instagram ? withHttps(user?.social_instagram) : null,
        },
        {
            icon: <i className="icon-pinterest display-block" />,
            url: user?.social_pinterest ? withHttps(user?.social_pinterest) : null,
        },
    ];
    const socialIsExists = () => {
        if (
            user?.social_facebook ||
            user?.social_instagram ||
            user?.social_pinterest ||
            user?.social_twitter
        ) {
            return true;
        }
        return false;
    };
    return socialIsExists() ? (
        <Box component="ul" mt={2.5} mb={3} mx={4} display="flex">
            {SOCIAL_MENU.map((item, i) => {
                return (
                    !!item.url && (
                        <Box component="li" mr={1} key={i} style={{ fontSize: 36 }}>
                            <a
                                href={`${item.url}`}
                                target="_blank"
                                className="color-secondary hover-opacity display-block"
                                rel="noreferrer"
                            >
                                {item.icon}
                            </a>
                        </Box>
                    )
                );
            })}
        </Box>
    ) : null;
};

SocialIcons.propTypes = {
    user: PropTypes.object,
};

export default SocialIcons;

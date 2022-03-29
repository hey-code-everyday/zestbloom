import React from 'react';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const FaqInfoCard = ({ config }) => {
    if (!config) return null;
    return config?.map((context, i) => (
        <Box display="flex" className="faq-item" key={i}>
            <Box className="faq-item-left">
                <Typography className="title">{context.title}</Typography>
                {context?.infos?.map((info, indexInfo) => (
                    <span key={indexInfo}>
                        <Typography className="description">&#9679; {info.description}</Typography>
                        {info?.extraInfo?.map((extra, indexExtra) => (
                            <Typography className="description" key={indexExtra}>
                                {extra}
                            </Typography>
                        ))}
                    </span>
                ))}
            </Box>
            {context?.img && (
                <Box className="faq-item-right">
                    <img src={context.img} alt="" />
                </Box>
            )}
        </Box>
    ));
};

FaqInfoCard.propTypes = {
    config: PropTypes.object,
};

export default FaqInfoCard;

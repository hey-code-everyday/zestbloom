import React from 'react';
import { Box } from '@material-ui/core';

const Tag = ({ text, icon, className }) => {
    return (
        <span className={`tag ${className}`}>
            {icon && <Box mr={0.8}>{icon}</Box>}
            {text}
        </span>
    );
};

export default Tag;

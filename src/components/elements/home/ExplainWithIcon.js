import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

const ExplainWithIcon = ({ color, iconSrc, text }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            maxWidth="150px"
            textAlign="center"
            mx={2}
        >
            <img
                src={iconSrc}
                alt={text}
                className={`bg-${color} rounded p-1 mb-2`}
                width="44"
                height="44"
            />
            <span className="bold font-small">{text}</span>
        </Box>
    );
};

ExplainWithIcon.propTypes = {
    color: PropTypes.oneOf(['orange', 'yellow', 'red', 'green']).isRequired,
    iconSrc: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default ExplainWithIcon;

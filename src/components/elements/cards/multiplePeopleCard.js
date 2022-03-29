import React from 'react';
import { Avatar, Box, Popover, Typography } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

const MultiplePeopleCard = ({ owners, setShowList }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ownerName, setOwnerName] = React.useState(null);
    const handlePopoverOpen = (event) => {
        let elem = event.target;
        if (elem.tagName !== 'DIV') {
            elem = elem.parentNode;
        }
        setOwnerName(elem.getAttribute('name').length > 1 ? elem.getAttribute('name') : 'Unkown');
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const history = useHistory();
    const onSubmit = (e) => {
        if (e.target.alt && e.target.alt !== 'Private')
            return history.push(`/profile/${e.target.alt}`);
    };
    const expand = (e) => {
        // setShowList(true);
    };
    return (
        <Box
            className="multiple-people-card"
            display="flex"
            alignItems="center"
            paddingTop="0.5rem"
        >
            <div className="min-avatar circle">
                <AvatarGroup max={3}>
                    <Avatar
                        alt={owners[0].owner.username}
                        name={owners[0].owner.username}
                        src={!!owners[0].owner.avatar ? owners[0].owner.avatar : './'}
                        key={owners[0].guid}
                        onClick={onSubmit}
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseOver={(e) => {
                            e.target.style.cursor = 'pointer';
                        }}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    />
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorReference="anchorEl"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <div className="popup-info">
                            <Typography sx={{ p: 2 }}>Owner: {ownerName}</Typography>
                        </div>
                    </Popover>
                    <Avatar onClick={expand}>+{owners.length - 1}</Avatar>
                </AvatarGroup>
            </div>
        </Box>
    );
};

MultiplePeopleCard.propTypes = {
    owners: PropTypes.array,
    setShowList: PropTypes.func,
};

export default MultiplePeopleCard;

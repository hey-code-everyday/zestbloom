import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import ButtonTag from '../../../components/shared/ButtonTag';
import Field from '../../../components/shared/fields/Field';
import { getTags } from '../../../redux/profile-settings/actions';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));
const Tag = (props) => {
    const dispatch = useDispatch();
    let { tags } = useSelector((state) => state.profileSettings);
    const [abortRequest, setAbortRequest] = useState(null);

    useEffect(() => {
        dispatch(getTags());
    }, [dispatch]);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    return (
        <>
            <Box className="section border" pb={6}>
                <Box
                    fontSize="1.25rem"
                    fontWeight="bold"
                    fontFamily="h2.fontFamily"
                    mt="1.5rem"
                    mb="1.5rem"
                >
                    Which tags describe you best
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
                    {tags
                        ?.filter((tag) => tag.type === 'static')
                        .map((item, i) => (
                            <ButtonTag
                                key={i}
                                text={item.name}
                                selected={item.selected}
                                slug={item.slug}
                                className={`${item.selected ? 'selected' : ''}`}
                                icon={item.icon}
                                category={item.type}
                                setAbortRequest={setAbortRequest}
                                abortRequest={abortRequest}
                            />
                        ))}
                    {tags
                        ?.filter((tag) => tag.type === 'custom')
                        .map((item, i) => (
                            <ButtonTag
                                key={i}
                                text={item.name}
                                selected={item.selected}
                                slug={item.slug}
                                className={`${item.selected ? 'selected' : 'custom'}`}
                                icon={item.icon}
                                category={item.type}
                                setAbortRequest={setAbortRequest}
                                abortRequest={abortRequest}
                            />
                        ))}
                    <Box className="custom-label">
                        <Box className="new-label">
                            <i className="icon-label" style={{ fontSize: 24 }} />
                            <Field
                                field="input"
                                type="text"
                                className="no-margin"
                                placeholder="Add Custom"
                                name="custom_label"
                                {...props.formik.getFieldProps('custom_label')}
                            />
                        </Box>
                        <i
                            className="popover-icon icon-information-outline"
                            aria-owns={openPopover ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        />
                    </Box>
                </Box>
            </Box>
            <Popover
                className={`${classes.popover} info-popover`}
                classes={{
                    paper: classes.paper,
                }}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>
                    You can write a custom tag and hit enter to save it. You can select only one
                    custom tag out of those that you have created
                </Typography>
            </Popover>
        </>
    );
};

Tag.propTypes = {
    formik: PropTypes.object,
};

export default Tag;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, List, ListItem, Typography } from '@material-ui/core';
import MiniInfoModal from '../modal/miniInfoModal';
import {
    getAssetsStaticTags,
    searchPeopleFromFooter,
    setFilterByTagFromSide,
} from 'redux/marketplace/actions';
import { needToLoginAction } from 'redux/auth/actions';
import { AboutAnchorContext } from '../MainRoute';

const FooterMenu = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [joinTeam, setJoinTeam] = useState(false);
    const [reportContent, setReportContent] = useState(false);
    const [emailUs, setEmailUs] = useState(false);
    const [helpCenter, setHelpCenter] = useState(false);
    const anchorRef = useContext(AboutAnchorContext);
    const { assetsStaticTags } = useSelector((state) => state.marketplace);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAssetsStaticTags());
    }, [dispatch]);

    const fromMarketPlace = () => {
        if (location.pathname === '/marketplace') {
            window.scrollTo(0, 0);
        }
    };

    const onSubmit = (slug) => {
        dispatch(setFilterByTagFromSide(slug));
        fromMarketPlace();
    };

    const searchPeople = (sort) => {
        dispatch(searchPeopleFromFooter('people', sort));
        fromMarketPlace();
    };

    const onClickMyProfile = (e) => {
        if (!user?.username) {
            e.preventDefault();
            dispatch(needToLoginAction(true));
        }
    };

    const onOpenJoinTeamModal = () => {
        onCloseJoinTeamModal();
        setJoinTeam(true);
    };

    const onCloseJoinTeamModal = () => {
        setJoinTeam(false);
    };

    const onOpenReportContent = () => {
        onCloseReportContent();
        setReportContent(true);
    };

    const onCloseReportContent = () => {
        setReportContent(false);
    };

    const onOpenEmailUs = () => {
        onCloseEmailUs();
        setEmailUs(true);
    };

    const onCloseEmailUs = () => {
        setEmailUs(false);
    };

    const onOpenHelpCenter = () => {
        onCloseHelpCenter();
        setHelpCenter(true);
    };

    const onCloseHelpCenter = () => {
        setHelpCenter(false);
    };

    const onScrollToAbout = () => {
        if (anchorRef.current) {
            window.scrollTo({ top: anchorRef.current.offsetTop, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Grid item className="footer-nav-item">
                <Box mb={2}>
                    <Typography
                        variant="h4"
                        style={{ textTransform: 'uppercase', fontWeight: 800 }}
                    >
                        ARTISTS
                    </Typography>
                </Box>
                <List>
                    <ListItem disableGutters dense>
                        <Link
                            to={user?.username ? `/profile/${user?.username}` : '#'}
                            className="hover-opacity"
                            onClick={onClickMyProfile}
                        >
                            My Profile
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link
                            to="/marketplace?type=people"
                            className="hover-opacity"
                            onClick={() => searchPeople('creator')}
                        >
                            Creators
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link
                            to="/marketplace?type=people"
                            className="hover-opacity"
                            onClick={() => searchPeople('collector')}
                        >
                            Collectors
                        </Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item className="footer-nav-item">
                <Box mb={2}>
                    <Typography
                        variant="h4"
                        style={{ textTransform: 'uppercase', fontWeight: 800 }}
                    >
                        MARKETPLACE
                    </Typography>
                </Box>
                <List>
                    {assetsStaticTags?.map((tag) => (
                        <ListItem disableGutters dense key={tag.slug}>
                            <Link
                                to="/marketplace"
                                onClick={() => onSubmit(tag.slug)}
                                className="hover-opacity"
                            >
                                {tag.name}
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item className="footer-nav-item">
                <Box mb={2}>
                    <Typography
                        variant="h4"
                        style={{ textTransform: 'uppercase', fontWeight: 800 }}
                    >
                        COMPANY
                    </Typography>
                </Box>
                <List>
                    <ListItem disableGutters dense>
                        <Link to="/" onClick={onScrollToAbout} className="hover-opacity">
                            About
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <a
                            href={'https://medium.com/@zestbloom'}
                            target="_blank"
                            className="hover-opacity"
                            rel="noreferrer"
                        >
                            Blog
                        </a>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link to="#" className="hover-opacity" onClick={onOpenJoinTeamModal}>
                            Join the Team
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link to="/community_guidelines" className="hover-opacity">
                            Community Guidelines
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link to="#" className="hover-opacity" onClick={onOpenReportContent}>
                            Report Content
                        </Link>
                    </ListItem>
                </List>
            </Grid>
            <Grid item className="footer-nav-item">
                <Box mb={2}>
                    <Typography
                        variant="h4"
                        style={{ textTransform: 'uppercase', fontWeight: 800 }}
                    >
                        JOIN
                    </Typography>
                </Box>
                <List>
                    <ListItem disableGutters dense>
                        <Link to="#" className="hover-opacity" onClick={onOpenEmailUs}>
                            Email Us
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link to="/faq" className="hover-opacity">
                            FAQs
                        </Link>
                    </ListItem>
                    <ListItem disableGutters dense>
                        <Link to="#" className="hover-opacity" onClick={onOpenHelpCenter}>
                            Help Center
                        </Link>
                    </ListItem>
                </List>
            </Grid>
            <MiniInfoModal
                open={joinTeam}
                close={onCloseJoinTeamModal}
                email="jobs@zestbloom.com"
                title="Get in touch with us"
            />
            <MiniInfoModal
                open={reportContent}
                close={onCloseReportContent}
                email="report@zestbloom.com"
                title="Get in touch with us"
            />
            <MiniInfoModal
                open={emailUs}
                close={onCloseEmailUs}
                email="team@zestbloom.com"
                title="Get in touch with us"
            />
            <MiniInfoModal
                open={helpCenter}
                close={onCloseHelpCenter}
                email="help@zestbloom.com"
                title="Get in touch with us"
            />
        </>
    );
};

export default FooterMenu;

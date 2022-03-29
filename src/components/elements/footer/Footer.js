import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Grid, Box } from '@material-ui/core';
import { Logo } from 'components/shared';
import { SOCIAL_MENU } from './footerConfig';
import FooterMenu from './FooterMenu';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="footer">
                <div className="footer-bg" />
                <div className="footer-bg" />
                <div className="footer-bg" />
                <Container maxWidth="xl" className="footer-main">
                    <Box textAlign="center">
                        <Box mb={5}>
                            <Typography variant="h3">Community</Typography>
                        </Box>

                        <Box
                            component="ul"
                            mb={{ xs: 8, sm: 16 }}
                            display="flex"
                            justifyContent="center"
                            flexWrap="wrap"
                        >
                            {SOCIAL_MENU.map((item, i) => (
                                <Box key={i} className="social-menu-item" component="li">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="color-secondary hover-opacity display-block"
                                    >
                                        {item.icon}
                                    </a>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Grid container justifyContent="space-between">
                        <FooterMenu />
                    </Grid>
                </Container>

                <div className="footer-bottom">
                    <Container maxWidth="xl">
                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            className="footer-bottom-content"
                        >
                            <Grid item>
                                <Box display="flex" alignItems="center">
                                    <Logo type="logoIconGray" width="45" />
                                    <p className="copyright">
                                        Zestbloom &copy; {currentYear} Zestbloom, Inc.
                                    </p>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box component="ul" display="flex">
                                    <Box component="li">
                                        <Link to="/terms_of_service" className="hover-opacity">
                                            Terms of Service
                                        </Link>
                                    </Box>
                                    <Box component="li" ml={3}>
                                        <Link to="/privacy_policy" className="hover-opacity">
                                            Privacy Policy
                                        </Link>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </footer>
        </>
    );
};

export default Footer;

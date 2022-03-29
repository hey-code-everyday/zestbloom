import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
// import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const BreadcrumbsNav = () => {
    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            className="breadcrumbs"
        >
            <Link color="inherit" to="/">
                Home
            </Link>
            <Link color="inherit" to="/marketplace">
                Marketplace
            </Link>
            <Typography>Auction</Typography>
        </Breadcrumbs>
    );
};

export default BreadcrumbsNav;

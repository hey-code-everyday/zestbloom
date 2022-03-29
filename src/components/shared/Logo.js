import React from 'react';
import { useSelector } from 'react-redux';
// import logo from 'assets/img/logo.svg';
import logo from 'assets/img/zb-new/logo-with-text.svg';
import logoDarkMode from 'assets/img/zb-new/logo-with-text-dark-mode.svg';
import logoIcon from 'assets/img/logo-icon.svg';
import logoGray from 'assets/img/logo-gray.svg';
import logoIconGray from 'assets/img/logo-icon-gray.svg';
import logoFooterDarkMode from 'assets/img/zb-new/logo-footer-dark-mode.svg';

const LOGO_TYPES = {
    darkMode: {
        logo: logoDarkMode,
        logoIcon,
        logoGray,
        logoIconGray: logoFooterDarkMode,
    },
    lightMode: {
        logo,
        logoIcon,
        logoGray,
        logoIconGray,
    },
};

const Logo = ({ type, width }) => {
    const { isDarkMode } = useSelector((state) => state.profile);
    const logos = isDarkMode ? LOGO_TYPES.darkMode : LOGO_TYPES.lightMode;
    const src = logos[type];

    return <img src={src} width={width} alt="Logo" />;
};

export default Logo;

import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';

import { Tabs } from 'components/shared';
import { changeProfileTabesType } from '../../redux/profile/actions';
import { TABS } from 'configs';
import { cleanCreatedAssets } from 'redux/createdAsset/actions';
import { cleanUpCollectedItems } from 'redux/collectedAssets/actions';
import useWindowDimensions from 'hooks/useWindowDimensions';
import SelectProfilePanes from 'components/shared/SelectProfilePanes';
import PropTypes from 'prop-types';

const ProfileTabs = ({ username, type, tabNumber }) => {
    const { tab } = useParams();
    const dispatch = useDispatch();
    const { user: authUser, isLoggedIn } = useSelector((state) => state.auth);
    const isAuthUser = authUser?.username === username;
    const { isMobile } = useWindowDimensions();

    const findTabNumber = (tabs, tab) => tabs.findIndex(({ label }) => label.toLowerCase() === tab);

    useEffect(() => {
        return () => {
            dispatch(cleanCreatedAssets());
            dispatch(cleanUpCollectedItems());
        };
    }, [dispatch]);

    const tabs = useCallback(() => {
        if (!isLoggedIn) {
            return TABS.PROFILE_TABS_NON_LOGGED;
        }

        const followTabs = authUser?.sale_amount_visibility
            ? TABS.PROFILE_FOLLOWER_TABS
            : TABS.PROFILE_FOLLOWER_TABS.slice(0, 2);

        if (findTabNumber(followTabs, tab) > -1) {
            return followTabs;
        }

        return isAuthUser ? TABS.PROFILE_TABS_OWN : TABS.PROFILE_TABS;
    }, [authUser?.sale_amount_visibility, isAuthUser, isLoggedIn, tab]);

    const backFromFollowers = () => {
        dispatch(changeProfileTabesType({ type: 'default', tabNumber: 0 }));
    };

    const backBtn = (
        <IconButton
            className="back-btn icon-btn md containedPrimary rect"
            disableRipple
            disableFocusRipple
            onClick={backFromFollowers}
        >
            <ChevronLeft style={{ fontSize: 26 }} />
        </IconButton>
    );

    const tabsToShow = tabs();
    const tabNumberFromPath = tabsToShow.findIndex(({ label }) => label.toLowerCase() === tab);
    const number = tabNumberFromPath >= 0 ? tabNumberFromPath : tabNumber;
    const Component = tabsToShow[number].component;

    return isMobile ? (
        <div className="mobile-profile-panes">
            <SelectProfilePanes
                value={tab}
                handleChange={(val) => console.log('==>> val: ', val)}
                items={tabsToShow}
            />
            <div>{Component}</div>
        </div>
    ) : (
        <div className="profile-tabs">
            <Tabs
                tabs={tabsToShow}
                tabNumber={number}
                leftComponent={type === 'follow' ? backBtn : null}
            />
        </div>
    );
};

ProfileTabs.propTypes = {
    username: PropTypes.string,
    type: PropTypes.string,
    tabNumber: PropTypes.number,
};

export default ProfileTabs;

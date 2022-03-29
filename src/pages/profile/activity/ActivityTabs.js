import React from 'react';
import { Tabs } from 'components/shared';
import { IconButton } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { TABS } from 'configs';
const ActivityTabs = () => {
    const backBtn = (
        <IconButton
            className="back-btn icon-btn md containedPrimary rect"
            disableRipple
            disableFocusRipple
        >
            <ChevronLeft style={{ fontSize: 26 }} />
        </IconButton>
    );
    return (
        <div className="profile-tabs">
            <Tabs tabs={TABS.ACTIVITY_TABS} leftComponent={backBtn} />
        </div>
    );
};

export default ActivityTabs;

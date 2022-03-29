import React from 'react';
import { Tabs } from 'components/shared';
import PeopleMinCard from 'components/elements/cards/peopleMinCard';
import Activities from './Activities';
import PropTypes from 'prop-types';

const PreviewTabs = ({ collectors, activities, fromSinglePage = false }) => {
    const PREVIEW_TABS = [
        {
            label: 'Collectors',
            component: (
                <div className="collector-tab">
                    {collectors?.map((x) => {
                        return (
                            <PeopleMinCard
                                tags={x?.owner?.selected_tags}
                                author={x?.owner?.username}
                                authorAvatar={x?.owner?.avatar}
                                key={x?.guid}
                            />
                        );
                    })}
                </div>
            ),
        },
        {
            label: 'Activity',
            component: <Activities activities={activities} />,
        },
    ];
    return (
        <div className="preview-tabs">
            <Tabs tabs={PREVIEW_TABS} fromSinglePage={fromSinglePage} />
        </div>
    );
};

PreviewTabs.propTypes = {
    collectors: PropTypes.array,
    activities: PropTypes.array,
    fromSinglePage: PropTypes.bool,
};

export default PreviewTabs;

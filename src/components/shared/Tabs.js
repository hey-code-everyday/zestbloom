import React, { useEffect } from 'react';
import { Tabs as TabsComponent, Tab } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div hidden={value !== index} {...other}>
            {value === index && children}
        </div>
    );
}

const Tabs = ({ tabs, rightComponent, leftComponent, tabNumber, fromSinglePage }) => {
    const history = useHistory();
    const { username } = useParams();
    const [value, setValue] = React.useState(tabNumber || 0);

    useEffect(() => {
        if (tabNumber !== undefined) {
            setValue(tabNumber);
        }
    }, [tabNumber]);

    const handleChange = (e, newValue) => {
        setValue(newValue);
        if (!fromSinglePage)
            history.push(`/profile/${username}/${tabs[newValue].label.toLowerCase()}`);
    };

    return (
        <>
            <div className="tabs-header">
                {leftComponent && <div className="tabs-header-left">{leftComponent}</div>}
                <TabsComponent
                    value={value}
                    onChange={handleChange}
                    className="tabs-header-content"
                    style={{ overflow: 'visible' }}
                >
                    {tabs?.map((tab, i) => (
                        <Tab key={i} label={tab.label} />
                    ))}
                </TabsComponent>
                {rightComponent && <div className="tabs-header-right">{rightComponent}</div>}
            </div>

            <div className="tabs-content">
                {tabs?.map((tab, i) => (
                    <TabPanel key={i} value={value} index={i}>
                        {tab.component}
                    </TabPanel>
                ))}
            </div>
        </>
    );
};

Tabs.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    selectedItem: PropTypes.object,
    tabs: PropTypes.array,
    tabNumber: PropTypes.number,
    fromSinglePage: PropTypes.bool,
};

export default Tabs;

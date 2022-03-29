import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Container } from '@material-ui/core';
import {
    FAQ_CONFIG,
    COMMUNITY_GUIDELINES_CONFIG,
    PRIVACY_POLICI_CONFIG,
    TERMS_OF_SERVICE_CONFIG,
} from 'configs';
import FaqInfoCard from './faqInfoCard';
import { useHistory } from 'react-router';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box>
                <Typography component="span">{children}</Typography>
            </Box>
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const [value, setValue] = useState(0);
    const history = useHistory();

    const [CONFIG, setConfig] = useState(null);
    const [infoConfigName, setInfoConfigName] = useState(null);

    useEffect(() => {
        setConfig(switchConfig(history.location.pathname));
    }, [history.location.pathname]);

    useEffect(() => {
        setInfoConfigName(CONFIG?.titles[0]?.configName);
    }, [CONFIG]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const configName = CONFIG?.titles?.find((x) => x.index === newValue)?.configName;
        setInfoConfigName(configName);
        window.scrollTo(0, 0);
    };

    return (
        <Container maxWidth="xl">
            <Box display="flex" alignItems="flex-start" className="info-tabs">
                {CONFIG?.titles[0]?.label && (
                    <>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            scrollButtons="auto"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className="vertical-tabs"
                        >
                            {CONFIG?.titles?.map((title) => (
                                <Tab
                                    label={title?.label}
                                    className="tab-item"
                                    {...a11yProps(title.index)}
                                    key={title.index}
                                />
                            ))}
                        </Tabs>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                            className="horizontal-tabs"
                        >
                            {CONFIG?.titles?.map((title) => (
                                <Tab
                                    label={title?.label}
                                    className="tab-item"
                                    key={title.index}
                                    {...a11yProps(title.index)}
                                />
                            ))}
                        </Tabs>
                    </>
                )}
                {CONFIG && (
                    <TabPanel className="vertical-tab-content" style={{ margin: '0 auto' }}>
                        <FaqInfoCard config={CONFIG[infoConfigName]} value={value} />
                    </TabPanel>
                )}
            </Box>
        </Container>
    );
}

function switchConfig(path) {
    switch (path) {
        case '/faq':
            return FAQ_CONFIG;
        case '/community_guidelines':
            return COMMUNITY_GUIDELINES_CONFIG;
        case '/privacy_policy':
            return PRIVACY_POLICI_CONFIG;
        case '/terms_of_service':
            return TERMS_OF_SERVICE_CONFIG;
        default:
            return FAQ_CONFIG;
    }
}

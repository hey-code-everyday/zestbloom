import ProfileCollected from 'pages/profile/ProfileCollected';
import ProfileCreated from 'pages/profile/ProfileCreated';
import ProfileFavorites from 'pages/profile/ProfileFavorites';
import ProfileFollowing from 'pages/profile/ProfileFollowing';
import ProfileFollowers from 'pages/profile/ProfileFollowers';
import ProfileContracts from 'pages/profile/ProfileContracts';
import ActivityAll from 'pages/profile/activity/ActivityAll';
import ProfileSales from 'pages/profile/ProfileSales';

const PROFILE_TABS_OWN = [
    {
        label: 'Creations',
        component: <ProfileCreated />,
    },
    {
        label: 'Collection',
        component: <ProfileCollected />,
    },
    {
        label: 'Favorites',
        component: <ProfileFavorites />,
    },
    {
        label: 'Contracts',
        component: <ProfileContracts />,
    },
];
const PROFILE_TABS = [
    {
        label: 'Creations',
        component: <ProfileCreated />,
    },
    {
        label: 'Collection',
        component: <ProfileCollected />,
    },
];

const PROFILE_TABS_NON_LOGGED = [
    {
        label: 'Creations',
        component: <ProfileCreated />,
    },
];
const PROFILE_FOLLOWER_TABS = [
    {
        label: 'Followers',
        component: <ProfileFollowers />,
    },
    {
        label: 'Following',
        component: <ProfileFollowing />,
    },
    {
        label: 'Sales',
        component: <ProfileSales />,
    },
];

let ACTIVITY_TABS = [
    {
        label: 'All',
        component: <ActivityAll />,
    },
    {
        label: 'Following',
        component: '',
    },
    {
        label: 'My Activity',
        component: '',
    },
];

export const TABS = {
    PROFILE_TABS_OWN,
    PROFILE_TABS,
    PROFILE_FOLLOWER_TABS,
    ACTIVITY_TABS,
    PROFILE_TABS_NON_LOGGED,
};

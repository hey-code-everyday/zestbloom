import private_user_icon from 'assets/img/private_user_icon.png';

export const CREATOR = 'creator';
export const COLLECTOR = 'collector';
export const ANONYMOUS = 'anonymous';
export const PRIVATE = 'Private';

export const PRIVATE_OWNER = { username: PRIVATE, avatar: private_user_icon, selected_tag: null };

const most_followed = 'most_followed';
const a_z = 'a-z';
const most_voted = 'most_voted';
const new_creators = 'new_creators';

const featured_artist = 'featured-artist';

export const USER_FILTER = {
    most_followed,
    a_z,
    most_voted,
    new_creators,
    featured_artist,
};

import React from 'react';

// import AuctionNotification from './auction';
// import ActionBySomeone from './bySomeone';
// import MakeNew from './makeNew';
// import PlaceABid from './placeABid';
import ActionsWithAsset from './actionsWithAsset';
import PropTypes from 'prop-types';

const Notificationitem = ({ data, setNotifications }) => {
    return <ActionsWithAsset data={data} setNotifications={setNotifications} />;
};

Notificationitem.propTypes = {
    data: PropTypes.object,
    setNotifications: PropTypes.func,
};

export default Notificationitem;

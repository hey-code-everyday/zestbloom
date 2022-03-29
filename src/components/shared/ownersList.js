import { Box, Typography } from '@material-ui/core';
import PeopleMinCard from 'components/elements/cards/peopleMinCard';
import PropTypes from 'prop-types';

const OwnersList = ({ owners, currentAsset, giveNotification, holders }) => {
    const allNodes = owners.flatMap((owner) => {
        const auctions = owner?.auctions
            ?.filter((auction) => auction.status === 'STARTED')
            ?.map((auction) => ({ ...owner, sales: [], auctions: [auction] }));

        const sales = owner?.sales
            ?.filter((sale) => sale.status === 'ACTIVE' && sale.type === 'SaleByEscrow')
            .map((sale) => ({ ...owner, auctions: [], sales: [sale] }));

        const isHost = holders.find((holder) => owner?.holder === holder?.address);
        const host = isHost ? [{ ...owner, auctions: [], sales: [] }] : [];
        return [...auctions, ...sales, ...host];
    });

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            className="owners-box"
        >
            {allNodes.map((node, index) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    padding={(0, 1)}
                    key={`${node?.guid}${index}`}
                >
                    <Typography style={{ marginRight: 10, width: 20 }}>{index + 1}.</Typography>
                    <Box width={235}>
                        <PeopleMinCard
                            tags={node?.owner?.selected_tags}
                            author={node?.owner?.username}
                            authorAvatar={node?.owner?.avatar}
                            node={node}
                            currentAsset={currentAsset}
                            giveNotification={giveNotification}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

OwnersList.propTypes = {
    owners: PropTypes.array,
    currentAsset: PropTypes.object,
    giveNotification: PropTypes.func,
    holders: PropTypes.array,
};

export default OwnersList;

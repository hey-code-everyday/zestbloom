import AlgoFont from 'assets/img/algo-font.svg';
import { Box } from '@material-ui/core';

const offer = 'offer';
const sale = 'sale';

function offerContext(data) {
    return (
        <>
            <span>
                {data?.action_object?.teal_context?.offer_amount
                    ? (data?.action_object?.teal_context?.offer_amount / 1000000).toFixed(3)
                    : ''}
            </span>
            <img src={AlgoFont} alt="Algo" />
        </>
    );
}

function saleContext(data) {
    return (
        <>
            <span>
                {data?.action_object?.teal_context?.sale_amount
                    ? (data?.action_object?.teal_context?.sale_amount / 1000000).toFixed(3)
                    : ''}
            </span>
            <img src={AlgoFont} alt="Algo" />
        </>
    );
}

function getContext(activity) {
    switch (activity?.verb) {
        case offer:
            return offerContext(activity);
        case sale:
            return saleContext(activity);
        default:
            return null;
    }
}

export function showDescription(description, activity) {
    const showPrice = (
        <Box component="span" display="inline-block" ml={0.5}>
            <Box fontSize={20} fontWeight="bold" className="price-algo">
                {getContext(activity)}
            </Box>
        </Box>
    );

    if ((description || []).includes('{offerAmount}')) {
        const split = description.split('{offerAmount}');
        return (
            <>
                {split[0]} {showPrice} {split[1]}
            </>
        );
    }
    return (
        <>
            {description}
            {showPrice}
        </>
    );
}

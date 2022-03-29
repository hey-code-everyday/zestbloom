import * as Yup from 'yup';

export const auctionCreateValidation = Yup.object({
    start_time: Yup.date()
        .min(new Date(Date.now() + 15 * 60 * 1000))
        .required(),
    end_time: Yup.date()
        .test(
            'min',
            'End time must be later than start time',
            (date, field) => date > field.parent.start_time,
        )
        .required(),
    reserve_price: Yup.number()
        .min(0, 'Reserve price must be greater than or equal to 0')
        .required('Reserve price is a required field'),
    min_bid_increment: Yup.number()
        .min(0, 'Min Bid Increment must be greater than or equal to 0')
        .required('Min Bid Increment is a required field'),
    snipe_trigger_window: Yup.number()
        .min(0, 'Snipe Trigger Window must be greater than or equal to 0')
        .max(15, 'Snipe Trigger Window should not be more than 15')
        .required('Snipe Trigger Window is a required field'),
    snipe_extension_time: Yup.number()
        .min(0, 'Snipe Extension Time must be greater than or equal to 0')
        .max(30, 'Snipe Extension Time should not be more than 30')
        .required('Snipe Extension Time is a required field'),
});

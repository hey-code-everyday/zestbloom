import * as Yup from 'yup';

export const placeBidValidation = Yup.object({
    price: Yup.number()
        .test(
            'min',
            'The price must be equal to or greater than the minimum bid',
            (data, field) => Number(data) >= field.parent.min_bid,
        )
        .required('Price is a required field'),
});

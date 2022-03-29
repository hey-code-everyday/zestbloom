import * as Yup from 'yup';

export const assetCreateValidationStep4 = Yup.object({
    price: Yup.number('Enter price')
        .test('min', 'Enter greater than 0', (data) => data > 0)
        .required('Price is required'),
});

export const assetCreateValidationStep4Offer = Yup.object({
    price: Yup.number('Enter price')
        .test('min', 'Enter greater than 0', (data) => data >= 0)
        .required('Price is required'),
});

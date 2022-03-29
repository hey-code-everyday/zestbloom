import * as Yup from 'yup';

export const editAssetValidation = Yup.object({
    price: Yup.number('Enter number').test(
        'min',
        'Enter greater than 0',
        (data) => Number(data) > 0,
    ),
});

export const editDefaultValidation = Yup.object({});

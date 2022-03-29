import * as Yup from 'yup';

export const makeAnOfferValidation = Yup.object({
    price: Yup.number('Enter price').min(0, 'Enter more than 0 ').required('Price is required'),
});

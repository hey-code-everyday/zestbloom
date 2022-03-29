import * as Yup from 'yup';

export const assetCreateValidationStep3 = Yup.object({
    quantity: Yup.number('Enter quantity').required('Quantity is required'),
    royalties: Yup.string()
        .test('number', 'The value must be number', (data) => {
            const value = data?.replace(/ |%/g, '');
            return (
                !!value && (Number(data?.replace(/%/, '')) || Number(data?.replace(/%/g, '')) === 0)
            );
        })
        .test('min', 'Enter greater than 0', (data) => Number(data?.replace(/%/g, '') >= 0))
        .test('max', 'Enter less than or equal to 30', (data) =>
            Number(data?.replace(/%/g, '') <= 30),
        )
        .test(
            'maxDigitsAfterDecimal',
            'number field must have 2 digits after decimal or less',
            (number) => {
                if (number) {
                    const val = number?.replace(/ %/g, '');
                    if (val.indexOf('.') !== -1) {
                        return val.split('.')[1].length <= 2;
                    }
                    return true;
                }
            },
        )
        .required('Royality is required'),
});

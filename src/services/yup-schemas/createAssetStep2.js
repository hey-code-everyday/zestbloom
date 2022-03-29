import * as Yup from 'yup';

export const assetCreateValidationStep2 = Yup.object({
    title: Yup.string('Enter asset name')
        .max(32, 'Must be no more than 32 characters')
        .required('Title is required'),
    unitName: Yup.string('Enter unit name').max(8, 'Must be no more than 8 characters'),
    description: Yup.string('Enter description')
        .max(1000, 'Error! The description cannot exceed 1KB.')
        .required('Description is required'),
    tag: Yup.string().required('Tags are Required'),
});

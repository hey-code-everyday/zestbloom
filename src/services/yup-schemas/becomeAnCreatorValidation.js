import * as Yup from 'yup';

export const becomeAnCreatorValidation = Yup.object().shape({
    artworks_url: Yup.string().url().required('The link is required'),
});

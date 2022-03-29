import * as Yup from 'yup';
import { linkValidation } from './constants';

export const updateProfileValidation = () =>
    Yup.object({
        firstName: Yup.string().required('First Name is a required'),
        lastName: Yup.string().required('Last Name is a required.'),
        bio: Yup.string(),
        facebook: Yup.string().matches(linkValidation.REGEX_LINK, linkValidation.MESSAGE),
        twitter: Yup.string().matches(linkValidation.REGEX_LINK, linkValidation.MESSAGE),
        instagram: Yup.string().matches(linkValidation.REGEX_LINK, linkValidation.MESSAGE),
        pinterest: Yup.string().matches(linkValidation.REGEX_LINK, linkValidation.MESSAGE),
    });
